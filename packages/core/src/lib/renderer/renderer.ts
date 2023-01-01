import {
  ChangeDetectorRef,
  inject,
  Injectable,
  Renderer2,
  RendererFactory2,
  RendererType2,
} from '@angular/core';
import { ɵDomRendererFactory2 as DomRendererFactory } from '@angular/platform-browser';
import { injectNgtCatalogue } from '../catalogue';
import { injectNgtStore } from '../stores/store';
import { NgtAnyConstructor, NgtAnyRecord } from '../types';
import { applyProps } from '../utils/apply-props';
import { getLocalState, prepare } from '../utils/instance';
import { is } from '../utils/is';
import { NgtRendererStateCollection } from './state';
import {
  attachThreeInstances,
  ATTRIBUTES,
  kebabToPascal,
  processThreeEvent,
  removeThreeChild,
  SPECIAL_DOM_TAG,
} from './utils';

export const NgtRendererFlags = {
  COMPOUND: '__ngt_compound__',
} as const;

type Catalogue = Record<string, NgtAnyConstructor>;

@Injectable()
export class NgtRendererFactory implements RendererFactory2 {
  readonly #delegateDomRendererFactory = inject(DomRendererFactory);
  readonly #catalogue = injectNgtCatalogue();
  readonly #rootCdr = inject(ChangeDetectorRef);
  readonly #rootStore = injectNgtStore();

  #defaultRenderer?: NgtRenderer;

  /**
   * We create the StateCollection singleton here with the information from Root providers
   */
  readonly #stateCollection = new NgtRendererStateCollection({
    scene: this.#rootStore.get('scene'),
    glDom: this.#rootStore.get('gl', 'domElement'),
    dom: null!,
    store: this.#rootStore,
    cdr: this.#rootCdr,
  });

  createRenderer(hostElement: any, type: RendererType2 | null): Renderer2 {
    if (!hostElement || !type) return this.#createRendererIfNotExist(hostElement, type);
    const componentType = type as NgtAnyRecord;
    const componentClass = componentType['type'];
    // handle Compound
    if (componentClass[NgtRendererFlags.COMPOUND]) {
      const domOptions = this.#stateCollection.getDom(hostElement);
      if (domOptions) domOptions.isCompound = true;
      this.#stateCollection.addCompound(hostElement, {
        inputs: Object.values(componentType['inputs']),
      });
    }
    return this.#createRendererIfNotExist(hostElement, type);
  }

  #createRendererIfNotExist(hostElement: any, type: RendererType2 | null): Renderer2 {
    if (!this.#defaultRenderer) {
      const domRenderer = this.#delegateDomRendererFactory.createRenderer(hostElement, type);
      this.#defaultRenderer = new NgtRenderer(domRenderer, this.#catalogue, this.#stateCollection);
    }
    return this.#defaultRenderer;
  }
}

/**
 * Welcome to Angular Three Renderer, if you're here, you are either curious
 * or wanting to contribute to this Renderer. Thank you
 *
 * The Renderer keeps track of some specific states to encounter the limitation of Angular Renderer,
 * as well as to accommodate the way that Structural Directives are handled in Angular
 */
export class NgtRenderer implements Renderer2 {
  #seenFirstElement = false;

  constructor(
    private readonly delegate: Renderer2,
    private readonly catalogue: Catalogue,
    private readonly stateCol: NgtRendererStateCollection
  ) {}

  createElement(name: string, namespace?: string | null | undefined) {
    // since we base the Renderer on DOM element as source of truth, we always create the Element here
    const el = this.delegate.createElement(name, namespace);

    // this is the first time that createElement event ran
    // we'll capture the root Scene component
    if (!this.#seenFirstElement) {
      this.#seenFirstElement = true;
      this.stateCol.root.dom = el;
      this.stateCol.addDomThree(el, this.stateCol.root.scene);
      return el;
    }

    // State Collection creation phase based on the Comments (from structural directives)
    const { injectedRef, injectedArgs, attach, store } = this.stateCol.getCreationState();

    // handle Portal to opt-out of normal rendering
    if (name === SPECIAL_DOM_TAG.NGT_PORTAL) {
      this.stateCol.addPortal(el);
      return el;
    }

    // handle raw value
    if (name === SPECIAL_DOM_TAG.NGT_VALUE) {
      if (!injectedArgs[0]) throw new Error(`[NGT] ngt-value without args is invalid`);
      const value = injectedArgs[0];
      this.stateCol.addDomThree(
        el,
        Object.assign(value, {
          __ngt__: {
            store,
            attach,
            args: injectedArgs,
            isRaw: true,
          },
        })
      );
      return el;
    }

    // with injectNgtRef, consumers can pass in ref with value. We respect that value
    if (injectedRef && injectedRef.nativeElement) {
      const injectedInstance = injectedRef.nativeElement;
      if (!is.instance(injectedInstance)) {
        prepare(injectedInstance, { store, attach });
      }
      this.stateCol.addDomThree(el, injectedInstance);
      this.stateCol.addThree(injectedInstance);
      return el;
    }

    // handle ngt-primitive and fail fast when not met requirement
    if (name === SPECIAL_DOM_TAG.NGT_PRIMITIVE) {
      if (!injectedArgs[0]) throw new Error(`[NGT] ngt-primitve without args is invalid`);
      const object = injectedArgs[0];
      if (!is.instance(object)) {
        prepare(object, { store, attach, args: injectedArgs, primitive: true });
      }
      this.stateCol.addDomThree(el, object);
      this.stateCol.addThree(object);
      return el;
    }

    const threeTag = name.startsWith('ngt') && !name.startsWith('ngts') ? name.slice(4) : name;
    const threeName = kebabToPascal(threeTag);
    const threeTarget = this.catalogue[threeName];

    if (threeTarget) {
      // create the THREE objects here with injectedArgs (default to [])
      const threeInstance = prepare(new threeTarget(...injectedArgs), {
        store,
        attach,
        args: injectedArgs,
      });
      const lS = getLocalState(threeInstance);
      // default attach property for Material and Geometry
      if (!attach) {
        if (is.material(threeInstance)) {
          lS.attach = ['material'];
        } else if (is.geometry(threeInstance)) {
          lS.attach = ['geometry'];
        }
      }
      // assign the reference to injectedRef
      if (injectedRef) injectedRef.nativeElement = threeInstance;
      this.stateCol.addDomThree(el, threeInstance);
      this.stateCol.addThree(threeInstance);
      return el;
    }

    this.stateCol.addDom(el);
    return el;
  }

  createComment(value: string) {
    const comment = this.delegate.createComment(value);
    // we track Comment for their Injector
    this.stateCol.addComment(comment);
    return comment;
  }

  appendChild(parent: any, newChild: any, shouldAppend = true): void {
    // methods inside of the Renderer can call appendChild anytime.
    // shouldAppend can be passed from other methods to let the Renderer know to NOT call
    // appendChild on the DomRenderer again
    if (shouldAppend) {
      this.delegate.appendChild(parent, newChild);
    }

    // try to assign the portal container
    if ((newChild as HTMLElement).localName === SPECIAL_DOM_TAG.NGT_PORTAL) {
      this.stateCol.tryAssignPortalContainer(newChild);
    } else if ((parent as HTMLElement).localName === SPECIAL_DOM_TAG.NGT_PORTAL) {
      this.stateCol.tryAssignPortalContainer(parent);
    }
    const parentThree = this.stateCol.getThree(parent);
    const childThree = this.stateCol.getThree(newChild);

    // THREE parent and THREE child
    if (parentThree && childThree && parentThree !== childThree) {
      attachThreeInstances(parentThree, childThree);
      // handle special case where a compounded component is not the top-level THREE instance
      // eg: ngts-compound -> ngt-group -> ngt-group -> ngt-group[ngtCompound]
      // last ngt-group needs to be compounded instead of the top level ngt-group
      let grandParent = parentThree.parent;
      if (!grandParent) return;
      let grandParentOptions = this.stateCol.getThreeOptions(grandParent);
      while (!grandParentOptions || !grandParentOptions.compoundParent) {
        grandParent = grandParent.parent;
        if (!grandParent) return;
        grandParentOptions = this.stateCol.getThreeOptions(grandParent);
      }
      if (grandParentOptions.compoundParent) {
        this.appendChild(grandParentOptions.compoundParent, newChild, false);
      }
      return;
    }

    if (parentThree && !childThree) {
      // we traverse the childNodes of newChild to try adding to the parentThree
      const domChildren = (newChild as HTMLElement).childNodes;
      let i = domChildren.length - 1;
      while (i >= 0) {
        const domChild = domChildren.item(i)!;
        const domThree = this.stateCol.getThree(domChild as HTMLElement);
        if (domThree) {
          this.appendChild(parent, domChild, false);
        }
        i--;
      }
      return;
    }

    // DOM parent, THREE child, compound
    if (!parentThree && childThree) {
      const parentOptions = this.stateCol.getDom(parent);
      const childThreeOptions = this.stateCol.getThreeOptions(childThree);
      if (parentOptions?.isCompound) {
        // if the parent is a Compound component
        // and the child is indeed a THREE instance to be compounded, track it
        if (childThreeOptions?.compound) {
          this.stateCol.addDomThree(parent, childThree);
          queueMicrotask(() => {
            const compoundOptions = this.stateCol.getCompoundOptions(parent);
            compoundOptions?.queueOps.forEach((op) => op());
            compoundOptions?.queueOps.clear();
          });
        } else if (childThreeOptions && !childThreeOptions.compoundParent) {
          // otherwise, we'll track the parent DOM (compound component)
          childThreeOptions.compoundParent = parent;
        }
      }

      // here we'll try to traverse the parentNode to find the THREE
      const [grandParent, grandParentThree] = this.stateCol.getGrandParentThree(parent);
      if (grandParentThree) {
        this.appendChild(grandParent, newChild, false);
      }
    }
  }

  insertBefore(parent: any, newChild: any, refChild: any, isMove?: boolean | undefined): void {
    this.delegate.insertBefore(parent, newChild, refChild, isMove);
    if (newChild === this.stateCol.root.dom) return;
    const parentThree = this.stateCol.getThree(parent);
    const childThree = this.stateCol.getThree(newChild);
    // either one has THREE instance, call appendChlid
    if (parentThree || childThree) {
      this.appendChild(parent, newChild, false);
    }
  }

  /**
   * removeChild needs to ensure that all the references in State Collection are removed
   */
  removeChild(parent: any, oldChild: any, isHostElement?: boolean | undefined): void {
    const parentThree = this.stateCol.getThree(parent);
    const childThree = this.stateCol.getThree(oldChild);
    const domChildren = (oldChild as HTMLElement).childNodes;

    // THREE parent and THREE child
    if (parentThree && childThree) {
      removeThreeChild(parentThree, childThree, true);
      this.stateCol.removeThreeState(childThree);
      this.stateCol.traverseAndRemoveChildNodes(domChildren, parentThree);
      this.stateCol.removeDomState(oldChild);
      this.delegate.removeChild(parent, oldChild, isHostElement);
      return;
    }

    // THREE parent and DOM child
    if (parentThree && !childThree) {
      this.stateCol.traverseAndRemoveChildNodes(domChildren, parentThree);
      this.stateCol.removeDomState(oldChild);
      this.delegate.removeChild(parent, oldChild, isHostElement);
      return;
    }

    // DOM parent and THREE child
    if (!parentThree && childThree) {
      const [grandParent, grandParentThree] = this.stateCol.getGrandParentThree(parent);
      if (grandParentThree) {
        this.removeChild(grandParent, oldChild, isHostElement);
      } else {
        this.stateCol.traverseAndRemoveChildNodes(domChildren);
        this.stateCol.removeDomState(oldChild);
      }
      this.delegate.removeChild(parent, oldChild, isHostElement);
      return;
    }

    this.stateCol.traverseAndRemoveChildNodes(domChildren);
    this.stateCol.removeDomState(oldChild);
    this.delegate.removeChild(parent, oldChild, isHostElement);
  }

  setAttribute(el: any, name: string, value: string, namespace?: string | null | undefined): void {
    const three = this.stateCol.getThree(el);
    if (three) {
      const localState = getLocalState(three);
      const threeOptions = this.stateCol.getThreeOptions(three);
      if (name === ATTRIBUTES.RENDER_PRIORITY) {
        // priority needs to be set as an attribute string
        // we then convert that string to number here. invalid number will be default to 0
        let priority = Number(value);
        if (isNaN(priority)) {
          priority = 0;
          console.warn(`[NGT] invalid value for "priority" attribute`);
        }
        threeOptions!.priority = priority;
        return;
      }

      if (name === ATTRIBUTES.ATTACH) {
        // handle attach attribute as string
        // attach can accept a dotted paths
        const paths = value.split('.');
        if (paths.length) localState.attach = paths;
        return;
      }

      if (name === ATTRIBUTES.COMPOUND) {
        threeOptions!.compound = {
          applyFirst: true,
          props: {},
        };
        return;
      }

      // coercion
      let maybeCoerced: any = value;
      if (maybeCoerced === '' || maybeCoerced === 'true' || maybeCoerced === 'false') {
        maybeCoerced = maybeCoerced === 'true' || maybeCoerced === '';
      } else if (!isNaN(Number(maybeCoerced))) {
        maybeCoerced = Number(maybeCoerced);
      }

      applyProps(three, { [name]: maybeCoerced });
      return;
    }
    this.delegate.setAttribute(el, name, value, namespace);
  }

  /*
   * Logic for [propertyBinding]
   */
  setProperty(el: any, name: string, value: any): void {
    const { isThree, isCompoundWithInstance, isCompoundNoInstance } =
      this.stateCol.getTargetFlags(el);
    const three = this.stateCol.getThree(el);
    if (name === 'autoRotate') {
      console.log(el, name, three);
    }
    if (isThree) {
      // skip this property binding if it is an Attribute instead
      if (Object.values(ATTRIBUTES).includes(name as typeof ATTRIBUTES[keyof typeof ATTRIBUTES])) {
        this.setAttribute(el, name, value);
        return;
      }
      const threeOptions = this.stateCol.getThreeOptions(three);
      if (
        threeOptions?.compound?.props &&
        name in threeOptions.compound.props &&
        !threeOptions.compound.applyFirst
      ) {
        value = threeOptions.compound.props['name'];
      }

      applyProps(three, { [name]: value });
      return;
    }
    if (isCompoundWithInstance) {
      // TODO: we might not need to handle the inputs here since Angualr seems to handle it
      const compoundOptions = this.stateCol.getCompoundOptions(el);
      if (compoundOptions?.inputs.includes(name)) {
        this.delegate.setProperty(el, name, value);
        return;
      }
      const threeOptions = this.stateCol.getThreeOptions(three);
      if (threeOptions?.compound) {
        Object.assign(threeOptions.compound, {
          props: { ...threeOptions.compound.props, [name]: value },
        });
      }
      applyProps(three, { [name]: value });
      return;
    }
    // at this point, we don't have the Compound instance yet. Queue it and queue it max 5 times
    if (isCompoundNoInstance) {
      queueMicrotask(() => {
        const compoundOptions = this.stateCol.getCompoundOptions(el);
        compoundOptions?.queueOps.add(() => {
          this.setProperty(el, name, value);
        });
      });
      return;
    }
    this.delegate.setProperty(el, name, value);
  }

  /*
   * Logic for (eventBinding)
   */
  listen(target: any, eventName: string, callback: (event: any) => boolean | void): () => void {
    const { isThree, isCompoundNoInstance, isCompoundWithInstance } =
      this.stateCol.getTargetFlags(target);
    const three = this.stateCol.getThree(target);
    if (isThree || isCompoundWithInstance) {
      const priority = this.stateCol.getThreeOptions(three)!.priority;
      return processThreeEvent(three, priority, eventName, callback, this.stateCol.root.cdr);
    }

    // again, compound doesn't have instance yet.queue it to 5 times max
    if (isCompoundNoInstance) {
      queueMicrotask(() => {
        const compoundOptions = this.stateCol.getCompoundOptions(target);
        compoundOptions?.queueOps.add(() => {
          compoundOptions?.cleanUps.add(this.listen(target, eventName, callback));
        });
      });
      return () => {};
    }
    return this.delegate.listen(target, eventName, callback);
  }

  get data(): { [key: string]: any } {
    return this.delegate.data;
  }

  destroyNode = null;
  parentNode = this.delegate.parentNode.bind(this.delegate);
  setValue = this.delegate.setValue.bind(this.delegate);
  destroy = this.delegate.destroy.bind(this.delegate);
  removeAttribute = this.delegate.removeAttribute.bind(this.delegate);
  addClass = this.delegate.addClass.bind(this.delegate);
  removeClass = this.delegate.removeClass.bind(this.delegate);
  setStyle = this.delegate.setStyle.bind(this.delegate);
  removeStyle = this.delegate.removeStyle.bind(this.delegate);
  selectRootElement = this.delegate.selectRootElement.bind(this.delegate);
  nextSibling = this.delegate.nextSibling.bind(this.delegate);
  createText = this.delegate.createText.bind(this.delegate);
}
