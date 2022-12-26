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
import { NgtRendererState, NgtRendererStateCollection } from './state';
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
 * lS: localState (THREE instances only)
 * rS: rendererState (DOM instances)
 */
export class NgtRenderer implements Renderer2 {
  #seenFirstElement = false;

  constructor(
    private readonly delegate: Renderer2,
    private readonly catalogue: Catalogue,
    private readonly stateCol: NgtRendererStateCollection
  ) {}

  createElement(name: string, namespace?: string | null | undefined) {
    if (!this.#seenFirstElement) {
      this.#seenFirstElement = true;
      const el = this.delegate.createElement(name, namespace);
      this.stateCol.root.dom = el;
      return this.stateCol.root.scene;
    }

    const { injectedRef, injectedArgs, attach, store } = this.stateCol.getCreationState();

    if (name === SPECIAL_DOM_TAG.NGT_PORTAL) {
      const el = this.delegate.createElement(name, namespace);
      this.stateCol.addPortal(el, {});
      return el;
    }

    if (injectedRef && injectedRef.nativeElement) {
      const injectedInstance = injectedRef.nativeElement;
      if (!is.instance(injectedInstance)) {
        prepare(injectedInstance, { store, isThree: true, attach });
      }

      return injectedInstance;
    }

    if (name === SPECIAL_DOM_TAG.NGT_PRIMITIVE) {
      if (!injectedArgs[0]) throw new Error(`[NGT] ngt-primitve without args is invalid`);
      const object = injectedArgs[0];
      if (!is.instance(object)) {
        prepare(object, { store, attach, args: injectedArgs, isThree: true, primitive: true });
      }
      return object;
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
      return threeInstance;
    }

    const el = this.delegate.createElement(name, namespace);
    this.stateCol.addDom(el, {});
    return el;
  }

  createComment(value: string) {
    const comment = this.delegate.createComment(value);
    this.stateCol.addComment(comment, {});
    return comment;
  }

  appendChild(parent: any, newChild: any): void {
    const pLS = getLocalState(parent);
    const cLS = getLocalState(newChild);

    // THREE parent, THREE Child
    if (pLS && cLS) {
      attachThreeInstances(parent, newChild);
      return;
    }

    // DOM parent, DOM child
    if (!pLS && !cLS) {
      const pRS = this.stateCol.get(parent);
      const cRS = this.stateCol.get(newChild);
      if (pRS.parent && !cRS.parent) {
        cRS.parent = pRS.parent;
      }
      cRS.parentStateFactory = (() => pRS) as () => NgtRendererState;
      this.delegate.appendChild(parent, newChild);
      return;
    }

    // THREE parent, DOM child
    if (pLS) {
      const cRS = this.stateCol.get(newChild);
      cRS.parent = parent;

      if (parent === this.stateCol.root.scene) {
        this.delegate.appendChild(this.stateCol.root.dom, newChild);
      }

      // TODO: we might lose some comments here because we don't know what the DOM parent of the THREE parent
      // TODO: figure out how NOT to lose this DOM child
      console.log('in THREE parent , DOM child -->', { parent, newChild, childRendererState: cRS });

      if (cRS.type === 'compound' && is.instance(cRS.instance)) {
        this.appendChild(parent, cRS.instance);
        return;
      }

      while (cRS.unprocessedThreeChildren.length) {
          const unprocessed = cRS.unprocessedThreeChildren.shift();
          this.appendChild(parent, unprocessed);
      }

      return;
    }

    // DOM parent, THREE child
    if (cLS) {
      const pRS = this.stateCol.get(parent);
      if (pRS.type === 'compound' && !is.instance(pRS.instance)) {
        const childLocalState = getLocalState(newChild);
        if (childLocalState.compound.isCompound) {
          pRS.instance = newChild;
        }
      }

      if (pRS.parent && is.instance(pRS.parent)) {
        this.appendChild(pRS.parent, newChild);
        return;
      }

      if (pRS.parentStateFactory) {
        const gpRS = pRS.parentStateFactory();
        if (gpRS.parent && is.instance(gpRS.parent)) {
          this.appendChild(gpRS.parent, newChild);
        } else if (gpRS.instance) {
          this.appendChild(gpRS.instance, newChild);
        }
      }

      if (!pRS.unprocessedThreeChildren.includes(newChild)) {
        pRS.unprocessedThreeChildren.push(newChild);
      }

      return;
    }

    this.delegate.appendChild(parent, newChild);
  }

  parentNode(node: any) {
    const rS = this.stateCol.get(node);
    if (rS && rS.parent) return rS.parent;
    if (rS && rS.parentStateFactory && rS.parentStateFactory().instance)
      return rS.parentStateFactory().instance;
    return this.delegate.parentNode(node);
  }

  insertBefore(parent: any, newChild: any, refChild: any, isMove?: boolean | undefined): void {
    if (newChild === this.stateCol.root.scene) {
      this.delegate.insertBefore(parent, this.stateCol.root.dom, refChild, isMove);
      return;
    }
    const refRS = this.stateCol.get(refChild);
    const pRS = refRS.parentStateFactory?.();
    if (
      pRS?.type === ('compound' as string) &&
      !is.instance(pRS.instance) &&
      is.instance(newChild)
    ) {
      pRS.instance = newChild;
    }
    this.appendChild(parent, newChild);
  }

  removeChild(parent: any, oldChild: any, isHostElement?: boolean | undefined): void {
    const pLS = getLocalState(parent);
    const cLS = getLocalState(oldChild);

    // THREE parent, THREE child
    if (pLS && cLS) {
      removeThreeChild(parent, oldChild, true);
      return;
    }
    // TODO: handle other cases
    this.delegate.removeChild(parent, oldChild, isHostElement);
  }

  setAttribute(el: any, name: string, value: string, namespace?: string | null | undefined): void {
    const rS = this.stateCol.get(el);
    // THREE
    if (!rS) {
      const lS = getLocalState(el);
      if (name === ATTRIBUTES.RENDER_PRIORITY) {
        // priority needs to be set as an attribute string
        // we then convert that string to number here. invalid number will be default to 0
        let priority = Number(value);
        if (isNaN(priority)) {
          priority = 0;
          console.warn(`[NGT] invalid value for "priority" attribute`);
        }
        lS.priority = priority;
        return;
      }

      if (name === ATTRIBUTES.ATTACH) {
        // handle attach attribute as string
        // attach can accept a dotted paths
        const paths = value.split('.');
        if (paths.length) lS.attach = paths;
        return;
      }

      if (name === ATTRIBUTES.COMPOUND) {
        lS.compound.isCompound = true;
        lS.compound.applyFirst = value === '' || value === 'first';
        return;
      }

      // coercion
      let maybeCoerced: any = value;
      if (maybeCoerced === '' || maybeCoerced === 'true' || maybeCoerced === 'false') {
        maybeCoerced = maybeCoerced === 'true' || maybeCoerced === '';
      } else if (!isNaN(Number(maybeCoerced))) {
        maybeCoerced = Number(maybeCoerced);
      }

      applyProps(el, { [name]: maybeCoerced });
      return;
    }
    this.delegate.setAttribute(el, name, value, namespace);
  }

  setProperty(el: any, name: string, value: any): void {
    const rS = this.stateCol.get(el);
    if (!rS) {
      if (Object.values(ATTRIBUTES).includes(name as typeof ATTRIBUTES[keyof typeof ATTRIBUTES])) {
        this.setAttribute(el, name, value);
        return;
      }
      const lS = getLocalState(el);
      /**
       * We reassign the value with the value from wrapper if
       * - the property name is in wrapper.props
       * - if the wrapperMode is 'last' (aka we apply the bindings from the wrapper AFTER we apply the bindings to the instance)
       *   eg:
       *   <ngts-box [position]="[1,2,3]"></ngts-box>
       *   <ngt-mesh [position]="[2,3,4]"></ngt-mesh> --> [2,3,4] takes precedence
       *   <ngt-mesh [position]="[2,3,4]" wrapperMode="last"></ngt-mesh> --> [1,2,3] takes precedence
       */
      if (lS?.compound?.shouldApplyFirst(name)) {
        value = lS.compound.props[name];
      }

      applyProps(el, { [name]: value });
      return;
    }
    if (rS.type === 'compound') {
      if (rS.inputs.includes(name)) {
        this.delegate.setProperty(el, name, value);
        return;
      }
      if (!rS.instance || (rS.instance && !is.instance(rS.instance))) {
        queueMicrotask(() => {
          this.setProperty(el, name, value);
        });
        return;
      }

      const instance = rS.instance;
      const iLS = getLocalState(instance);
      Object.assign(iLS.compound, { props: { ...iLS.compound.props, [name]: value } });
      applyProps(instance, { [name]: value });
      return;
    }
    this.delegate.setProperty(el, name, value);
  }

  listen(target: any, eventName: string, callback: (event: any) => boolean | void): () => void {
    const rS = this.stateCol.get(target);
    if (rS && rS.type !== 'compound') {
      return this.delegate.listen(target, eventName, callback);
    }

    if (rS && rS.type === 'compound') {
      if (rS.instance && getLocalState(rS.instance)) {
        return processThreeEvent(rS.instance, eventName, callback, this.stateCol.root.cdr);
      }

      queueMicrotask(() => {
        const refetchRS = this.stateCol.get(target);
        if (refetchRS.type === 'compound') {
          refetchRS.cleanUps.add(this.listen(refetchRS.instance, eventName, callback));
        }
      });
      return () => {};
    }

    if (!rS) {
      return processThreeEvent(target, eventName, callback, this.stateCol.root.cdr);
    }
    return this.delegate.listen(target, eventName, callback);
  }

  get data(): { [key: string]: any } {
    return this.delegate.data;
  }

  destroyNode = null;
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
