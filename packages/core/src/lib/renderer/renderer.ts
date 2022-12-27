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

export class NgtRenderer implements Renderer2 {
  #seenFirstElement = false;

  constructor(
    private readonly delegate: Renderer2,
    private readonly catalogue: Catalogue,
    private readonly stateCol: NgtRendererStateCollection
  ) {}

  createElement(name: string, namespace?: string | null | undefined) {
    const el = this.delegate.createElement(name, namespace);
    if (!this.#seenFirstElement) {
      this.#seenFirstElement = true;
      this.stateCol.root.dom = el;
      const sceneLocalState = getLocalState(this.stateCol.root.scene);
      sceneLocalState.parentDom = el;
      this.stateCol.addDomThree(el, this.stateCol.root.scene);
      return el;
    }

    const { injectedRef, injectedArgs, attach, store } = this.stateCol.getCreationState();

    if (name === SPECIAL_DOM_TAG.NGT_PORTAL) {
      this.stateCol.addPortal(el);
      return el;
    }

    if (injectedRef && injectedRef.nativeElement) {
      const injectedInstance = injectedRef.nativeElement;
      if (!is.instance(injectedInstance)) {
        prepare(injectedInstance, { store, isThree: true, attach });
      }
      this.stateCol.addDomThree(el, injectedInstance);
      this.stateCol.addThree(injectedInstance);
      return el;
    }

    if (name === SPECIAL_DOM_TAG.NGT_PRIMITIVE) {
      if (!injectedArgs[0]) throw new Error(`[NGT] ngt-primitve without args is invalid`);
      const object = injectedArgs[0];
      if (!is.instance(object)) {
        prepare(object, { store, attach, args: injectedArgs, isThree: true, primitive: true });
      }
      this.stateCol.addDomThree(el, object);
      this.stateCol.addThree(object);
      return el;
    }

    const threeTag = name.startsWith('ngt') && !name.startsWith('ngts') ? name.slice(4) : name;
    const threeName = kebabToPascal(threeTag);
    const threeTarget = this.catalogue[threeName];

    if (threeTarget) {
      const threeInstance = prepare(new threeTarget(...injectedArgs), {
        store,
        isThree: true,
        attach,
        args: injectedArgs,
      });
      const lS = getLocalState(threeInstance);
      if (!attach) {
        if (is.material(threeInstance)) {
          lS.attach = ['material'];
        } else if (is.geometry(threeInstance)) {
          lS.attach = ['geometry'];
        }
      }
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
    this.stateCol.addComment(comment);
    return comment;
  }

  appendChild(parent: any, newChild: any, shouldAppend = true): void {
    if (shouldAppend) {
      this.delegate.appendChild(parent, newChild);
    }
    if ((newChild as HTMLElement).localName === SPECIAL_DOM_TAG.NGT_PORTAL) {
      this.stateCol.tryAssignPortalContainer(newChild);
    } else if ((parent as HTMLElement).localName === SPECIAL_DOM_TAG.NGT_PORTAL) {
      this.stateCol.tryAssignPortalContainer(parent);
    }
    const parentThree = this.stateCol.getThree(parent);
    const childThree = this.stateCol.getThree(newChild);

    if (parentThree && childThree && parentThree !== childThree) {
      attachThreeInstances(parentThree, childThree);
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

    //    if (parentThree && !childThree) {
    //      console.log('[NGT] This case is unhandled.', { parent, newChild, parentThree });
    //    }

    // DOM parent, THREE child, compound
    if (!parentThree && childThree) {
      const parentOptions = this.stateCol.getDom(parent);
      const childThreeOptions = this.stateCol.getThreeOptions(childThree);
      if (parentOptions?.isCompound) {
        if (childThreeOptions?.compound) {
          this.stateCol.addDomThree(parent, childThree);
        } else if (childThreeOptions && !childThreeOptions.compoundParent) {
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
    if (parentThree || childThree) {
      this.appendChild(parent, newChild, false);
    }
  }

  removeChild(parent: any, oldChild: any, isHostElement?: boolean | undefined): void {
    const parentThree = this.stateCol.getThree(parent);
    const childThree = this.stateCol.getThree(oldChild);
    const domChildren = (oldChild as HTMLElement).childNodes;

    if (parentThree && childThree) {
      removeThreeChild(parentThree, childThree, true);
      this.stateCol.removeThreeState(childThree);
      this.stateCol.traverseAndRemoveChildNodes(domChildren, parentThree);
      this.stateCol.removeDomState(oldChild);
      this.delegate.removeChild(parent, oldChild, isHostElement);
      return;
    }

    if (parentThree && !childThree) {
      this.stateCol.traverseAndRemoveChildNodes(domChildren, parentThree);
      this.stateCol.removeDomState(oldChild);
      this.delegate.removeChild(parent, oldChild, isHostElement);
      return;
    }

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

  setProperty(el: any, name: string, value: any, fromQueue = 0): void {
    const { isThree, isCompoundWithInstance, isCompoundNoInstance } =
      this.stateCol.getTargetFlags(el);
    const three = this.stateCol.getThree(el);
    if (isThree) {
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
    if (isCompoundNoInstance && fromQueue <= 5) {
      queueMicrotask(() => {
        this.setProperty(el, name, value, fromQueue++);
      });
      return;
    }
    this.delegate.setProperty(el, name, value);
  }

  listen(
    target: any,
    eventName: string,
    callback: (event: any) => boolean | void,
    fromQueue = 0
  ): () => void {
    const { isThree, isCompoundNoInstance, isCompoundWithInstance } =
      this.stateCol.getTargetFlags(target);
    const three = this.stateCol.getThree(target);
    if (isThree || isCompoundWithInstance) {
      return processThreeEvent(three, eventName, callback, this.stateCol.root.cdr);
    }

    if (isCompoundNoInstance && fromQueue <= 5) {
      queueMicrotask(() => {
        const compoundOptions = this.stateCol.getCompoundOptions(target);
        compoundOptions?.cleanUps.add(this.listen(target, eventName, callback, fromQueue++));
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
