import {
  ChangeDetectorRef,
  DebugNode,
  ElementRef,
  getDebugNode,
  inject,
  Injectable,
  Provider,
  Renderer2,
  RendererFactory2,
  RendererStyleFlags2,
  RendererType2,
  Type,
} from '@angular/core';
import { ɵDomRendererFactory2 as DomRendererFactory } from '@angular/platform-browser';
import { injectNgtCatalogue } from '../catalogue';
import { NgtArgs } from '../directives/args';
import { NgtAttachArray } from '../directives/attach-array';
import { NgtAttachFn } from '../directives/attach-fn';
import { NgtRef } from '../directives/ref';
import { supportedEvents } from '../events';
import { NgtStore } from '../store';
import type {
  NgtAnyConstructor,
  NgtAnyRecord,
  NgtAttachFunction,
  NgtEventHandlers,
  NgtHasValidateForRenderer,
  NgtInstanceNode,
  NgtInstanceRendererState,
} from '../types';
import { applyProps } from '../utils/apply-props';
import { attach, detach } from '../utils/attach';
import { removeInteractivity } from '../utils/events';
import { invalidateInstance } from '../utils/instance';
import { instanceLocalState } from '../utils/instance-local-state';
import { is } from '../utils/is';
import { prepare } from '../utils/prepare';

const ANNOTATED_FLAGS = {
  NGT_SCENE: '__ngt_scene__',
  NGT_WRAPPER: '__ngt_wrapper__',
} as const;

const ATTRIBUTES = {
  BEFORE_RENDER_PRIORITY: 'priority',
  ATTACH: 'attach',
  WRAPPER_MODE: 'wrapperMode',
} as const;

const EVENTS = {
  BEFORE_RENDER: 'beforeRender',
} as const;

const SPECIAL_TAGS = {
  PORTAL: 'ngt-portal',
  PRIMITIVE: 'ngt-primitive',
  CANVAS_CONTAINER: 'ngt-canvas-container',
} as const;

export class NgtRendererState {
  threeType?: 'normal' | 'scene' | 'portal' | 'wrapper';
  nodeType: 'dom' | 'comment' | 'three' = 'dom';

  debugNodeFactory?: () => DebugNode;

  instance?: NgtInstanceNode;
  parent?: NgtInstanceNode;

  dom?: HTMLElement | Comment;

  parentDom?: HTMLElement;

  cleanUps = new Set<() => void>();

  ref?: ElementRef<NgtInstanceNode>;

  constructor(partial: Partial<NgtRendererState> = {}) {
    this.threeType = partial.threeType;
    this.nodeType = partial.nodeType!;
    this.debugNodeFactory = partial.debugNodeFactory;
    this.instance = partial.instance;
    this.parent = partial.parent;
    this.dom = partial.dom;
    this.parentDom = partial.parentDom;
    this.ref = partial.ref;
  }
}

export class NgtRendererStateCollection {
  private readonly commentMap = new Map<Comment, NgtRendererState>();
  private readonly domMap = new Map<HTMLElement, NgtRendererState>();
  private readonly threeMap = new Map<NgtInstanceNode, NgtRendererState>();

  addComment(comment: Comment, partial: Partial<NgtRendererState> = {}) {
    if (!this.commentMap.has(comment)) {
      this.commentMap.set(
        comment,
        new NgtRendererState({
          dom: comment,
          nodeType: 'comment',
          debugNodeFactory: () => getDebugNode(comment)!,
          ...partial,
        })
      );
    }

    return this.getComment(comment);
  }

  addDom(dom: HTMLElement, partial: Partial<NgtRendererState> = {}) {
    if (!this.domMap.has(dom)) {
      this.domMap.set(
        dom,
        new NgtRendererState({
          dom,
          nodeType: 'dom',
          debugNodeFactory: () => getDebugNode(dom)!,
          ...partial,
        })
      );
    }

    return this.getDom(dom);
  }

  addThree(three: NgtInstanceNode, partial: Partial<NgtRendererState> = {}) {
    if (!this.threeMap.has(three)) {
      this.threeMap.set(
        three,
        new NgtRendererState({
          threeType: 'normal',
          instance: three,
          nodeType: 'three',
          ...partial,
        })
      );
    }

    return this.getThree(three);
  }

  getComment(comment: Comment) {
    return this.commentMap.get(comment)!;
  }

  getDom(dom: HTMLElement) {
    return this.domMap.get(dom)!;
  }

  getThree(three: NgtInstanceNode) {
    return this.threeMap.get(three)!;
  }

  getState(target: any) {
    const state = this.getComment(target) || this.getDom(target) || this.getThree(target);
    if (!state) throw new Error(`[NGT] no state found`);
    return {
      state,
      nodeType: state.nodeType,
      threeType: state.threeType,
    };
  }

  removeState(child: any) {
    const { state, nodeType } = this.getState(child);
    state.cleanUps.forEach((cleanUp) => cleanUp());
    state.cleanUps.clear();

    delete state.instance;
    delete state.parent;
    delete state.dom;
    delete state.parentDom;
    delete state.debugNodeFactory;

    if (nodeType === 'dom') {
      this.domMap.delete(child);
    } else if (nodeType === 'three') {
      this.threeMap.delete(child);
    } else {
      this.commentMap.delete(child);
    }
  }

  processParentChild(parent: any, child: any) {
    let parentState = this.getDom(parent) || this.getThree(parent);
    if (!parentState) throw new Error(`[NGT] No parent state found`);

    const childState = this.getComment(child) || this.getDom(child) || this.getThree(child);
    if (!childState) throw new Error(`[NGT] No child state found`);

    if (parentState.threeType === 'scene') {
      if (!parentState.instance) {
        const oldParentState = parentState;
        // switch parent
        parent = this.processRootScene(parent);
        // assign root Scene on the old root DOM
        oldParentState.instance = parent;
      } else {
        parent = parentState.instance;
      }
      // switch parentState
      parentState = this.getThree(parent);
    }

    return {
      parent,
      child,
      parentState,
      childState,
      parentNodeType: parentState.nodeType,
      childNodeType: childState.nodeType,
      parentThreeType: parentState.threeType,
      childThreeType: childState.threeType,
    };
  }

  getStore(state: NgtRendererState) {
    let store: NgtStore | null | undefined = undefined;
    let debugNode = state.debugNodeFactory?.();
    if (debugNode) {
      store = debugNode.injector.get(NgtStore, null);
    }

    if (!store) {
      const domState =
        this.getDom(state.dom as HTMLElement) || this.getDom(state.parentDom as HTMLElement);
      if (!domState) return undefined;

      debugNode = domState.debugNodeFactory?.();
      if (!debugNode) return undefined;

      store = debugNode.injector.get(NgtStore, null);
    }
    if (!store) return undefined;
    return store;
  }

  getInitPhaseStates(): {
    injectedArgs: any[];
    injectedRef?: ElementRef<NgtInstanceNode> | null;
    attach?: string[] | NgtAttachFunction;
    store?: NgtStore;
  } {
    const ngtArgs = this.firstNonInjectedDirective(NgtArgs);
    const ngtRef = this.firstNonInjectedDirective(NgtRef);
    const ngtAttachArray = this.firstNonInjectedDirective(NgtAttachArray);
    const ngtAttachFn = this.firstNonInjectedDirective(NgtAttachFn);

    const injectedArgs = ngtArgs?.args || [];
    const injectedRef = ngtRef?.ref;

    const injectedAttachFn = ngtAttachFn?.attachFn;
    const injectedAttachArray = ngtAttachArray?.attachArray;

    const attach = injectedAttachFn || injectedAttachArray || undefined;
    const store =
      ngtArgs?.store ||
      ngtRef?.store ||
      ngtAttachArray?.store ||
      ngtAttachFn?.store ||
      this.tryGetStore();

    return { injectedArgs, injectedRef, store, attach };
  }

  tryGetCdrFromDom(dom: HTMLElement) {
    const domState = this.getDom(dom);
    if (!domState) return undefined;
    let cdr = domState.debugNodeFactory?.().injector.get(ChangeDetectorRef, null);
    if (!cdr && domState.parentDom) {
      const parentDomState = this.getDom(domState.parentDom);
      if (!parentDomState) return undefined;

      cdr = parentDomState.debugNodeFactory?.().injector.get(ChangeDetectorRef, null);
    }

    return cdr;
  }

  private tryGetStore() {
    let store: NgtStore | undefined;

    const domStates = Array.from(this.domMap.values());

    let i = domStates.length - 1;

    while (i >= 0) {
      // loop through dom states to find the closest store
      const debugNode = domStates[i].debugNodeFactory?.();
      if (!debugNode) continue;
      const ngtStore = debugNode.injector.get(NgtStore, null);
      if (ngtStore) {
        store = ngtStore;
        break;
      }

      i--;
    }

    return store;
  }

  private firstNonInjectedDirective<T extends NgtHasValidateForRenderer>(
    dir: Type<T>
  ): T | undefined {
    let nonInjectedDirective: T | undefined;
    // we only care about the comment states because structural directives create Comments
    const commentStates = Array.from(this.commentMap.values());

    let i = commentStates.length - 1;
    while (i >= 0) {
      // loop through comment states to find the directive
      // and we loop backwards because the latest added node is the closest one
      const debugNode = commentStates[i].debugNodeFactory?.();
      if (!debugNode) continue;
      const ngtDirective = debugNode.injector.get(dir, null);
      if (ngtDirective && ngtDirective.validate()) {
        nonInjectedDirective = ngtDirective;
        break;
      }
      i--;
    }

    return nonInjectedDirective;
  }

  private processRootScene(parent: HTMLElement) {
    const parentState = this.getDom(parent);
    if (!parentState) throw new Error(`[NGT] no parent state found`);
    const parentDebugNode = parentState.debugNodeFactory?.();
    if (!parentDebugNode) throw new Error(`[NGT] no parent debug node found`);
    const store = parentDebugNode.injector.get(NgtStore, null);
    if (!store) throw new Error(`[NGT] no store found on parent debug node`);
    const scene = store.get('scene');
    this.addThree(scene, {
      threeType: 'scene',
      dom: parent,
      parentDom: parent,
      debugNodeFactory: () => parentDebugNode,
      parent: null,
    });
    return scene;
  }
}

@Injectable()
export class NgtRendererFactory implements RendererFactory2 {
  private readonly delegateDomRendererFactory = inject(DomRendererFactory);
  private readonly catalogue = injectNgtCatalogue();
  private readonly debugNodeMap = new Map<NgtInstanceNode, DebugNode>();
  private readonly rendererStateMap = new Map<NgtInstanceNode, NgtInstanceRendererState>();
  private readonly rendererStateCollection = new NgtRendererStateCollection();
  private defaultRenderer?: NgtRenderer;

  createRenderer(hostElement: any, type: RendererType2 | null): Renderer2 {
    // console.log('createRenderer -->', { hostElement, type });
    if (!hostElement || !type) return this.createRendererIfNotExist(hostElement, type);

    const componentClass = (type as NgtAnyRecord)['type'];
    const componentState = this.rendererStateCollection.getDom(hostElement);

    if (componentClass[ANNOTATED_FLAGS.NGT_SCENE]) {
      componentState.threeType = 'scene';
    } else if (componentClass[ANNOTATED_FLAGS.NGT_WRAPPER]) {
      componentState.threeType = 'wrapper';
    }

    return this.createRendererIfNotExist(hostElement, type);
  }

  private createRendererIfNotExist(hostElement: any, type: RendererType2 | null): Renderer2 {
    if (!this.defaultRenderer) {
      this.defaultRenderer = new NgtRenderer(
        this.delegateDomRendererFactory.createRenderer(hostElement, type),
        this.rendererStateCollection,
        this.catalogue
      );
    }
    return this.defaultRenderer;
  }
}

export class NgtRenderer implements Renderer2 {
  constructor(
    private delegateRenderer: Renderer2,
    private rendererStateCollection: NgtRendererStateCollection,
    private catalogue: Record<string, NgtAnyConstructor>
  ) {}

  appendChild(parent: any, newChild: any, fromInsertBefore = false): void {
    console.log('appendChild -->', { parent, newChild });

    const {
      parentState,
      parentNodeType,
      parentThreeType,
      childState,
      childNodeType,
      childThreeType,
      ...rest
    } = this.rendererStateCollection.processParentChild(parent, newChild);
    parent = rest.parent;
    newChild = rest.child;

    console.log({
      parent,
      newChild,
      parentState,
      parentNodeType,
      parentThreeType,
      childState,
      childNodeType,
      childThreeType,
    });

    if (childNodeType === 'dom') {
      if (parentNodeType === 'three') {
        childState.parent = parent;
        childState.parentDom = parentState.parentDom || (parentState.dom as HTMLElement);
      } else if (parentNodeType === 'dom') {
        childState.parentDom = parent;
        if (!childState.parent && parentState.parent) {
          childState.parent = parentState.parent;
        }
      }
      if (childState.parentDom) {
        this.tryAppendDom(childState.parentDom, newChild, fromInsertBefore);
      }
      return;
    }

    if (childNodeType === 'comment') {
      if (!childState.parent && parentState.instance) {
        childState.parent = parentState.instance;
      }

      if (!childState.parent && !parentState.instance && parentState.parent) {
        childState.parent = parentState.parent;
      }

      if (parentNodeType === 'three') {
        childState.parentDom = parentState.parentDom;
        if (childState.parentDom) {
          this.tryAppendDom(childState.parentDom, newChild, fromInsertBefore);
        }
      } else if (parentNodeType === 'dom') {
        childState.parentDom = parent;
        this.tryAppendDom(parent, newChild, fromInsertBefore);
      }
      return;
    }

    if (childNodeType === 'three') {
      if (parentThreeType === 'wrapper') {
        let useParentInstance = false;
        if (parentNodeType === 'dom') {
          parentState.instance = newChild;
          parentState.nodeType = 'three';

          if (parentState.ref) {
            parentState.ref.nativeElement = newChild;
          }

          useParentInstance = true;
        }
        if (!parentState.instance) throw new Error(`[NGT] fail to append child to THREE wrapper`);
        childState.parentDom = parent;
        childState.debugNodeFactory = () => parentState.debugNodeFactory!();
        if (useParentInstance && parentState.parent) {
          this.appendChild(parentState.parent, newChild);
        } else if (parentState.instance && parentState.instance !== newChild) {
          this.appendChild(parentState.instance, newChild);
        }
        return;
      }

      if (parentNodeType === 'dom') {
        childState.parentDom = parent;
        if (childThreeType === 'wrapper') {
          this.delegateRenderer.appendChild(parent, newChild);
        }

        if (
          parentState.parent &&
          childState.instance &&
          parentState.parent !== childState.instance
        ) {
          this.appendChild(parentState.parent, childState.instance);
        }
        return;
      }

      if (parentNodeType === 'three') {
        if (!childState.debugNodeFactory && parentState.debugNodeFactory) {
          childState.debugNodeFactory = () => parentState.debugNodeFactory!();
        }

        if (!childState.parentDom && (parentState.dom || parentState.parentDom)) {
          childState.parentDom = (parentState.dom || parentState.parentDom) as HTMLElement;
        }

        attachThreeInstances(
          parent,
          newChild,
          parentState,
          childState,
          this.rendererStateCollection
        );
      }
    }
  }

  private tryAppendDom(
    parentDom: HTMLElement,
    childDom: HTMLElement | Comment,
    fromInsertBefore = false
  ) {
    if (!fromInsertBefore) {
      this.delegateRenderer.appendChild(parentDom, childDom);
    }
  }

  createComment(value: string): any {
    console.log('createComment -->', { value });
    const comment = this.delegateRenderer.createComment(value);
    this.rendererStateCollection.addComment(comment);
    return comment;
  }

  createElement(name: string, namespace?: string | null): any {
    console.log('createElement -->', { name, namespace });

    if (name === SPECIAL_TAGS.PORTAL) {
      // TODO: handle portal
      return this.delegateRenderer.createElement(name, namespace);
    }

    const { injectedRef, injectedArgs, store, attach } =
      this.rendererStateCollection.getInitPhaseStates();

    // handle injectedRef
    if (injectedRef && injectedRef.nativeElement) {
      const injectedInstance = injectedRef.nativeElement;
      if (!is.instance(injectedInstance)) {
        prepare(injectedInstance, { store, isThree: true, attach });
      }

      this.rendererStateCollection.addThree(injectedInstance, { threeType: 'normal' });
      return injectedInstance;
    }

    // handle primitive
    if (name === SPECIAL_TAGS.PRIMITIVE) {
      if (!injectedArgs[0]) throw new Error(`[NGT] ngt-primitive without args is invalid`);
      const object = injectedArgs[0];
      if (!is.instance(object)) {
        prepare(object, { isThree: true, store, primitive: true, args: injectedArgs, attach });
      }
      this.rendererStateCollection.addThree(object, { threeType: 'normal' });
      return object;
    }

    const threeTag = name.startsWith('ngt') && !name.startsWith('ngts') ? name.slice(4) : name;
    const threeName = kebabToPascal(threeTag);
    const threeTarget = this.catalogue[threeName];

    if (threeTarget) {
      const threeInstance = prepare(new threeTarget(...injectedArgs), {
        isThree: true,
        store,
        args: injectedArgs,
        attach,
      });
      this.rendererStateCollection.addThree(threeInstance, { threeType: 'normal' });

      const localState = instanceLocalState(threeInstance)!;
      if (!attach) {
        if (is.material(threeInstance)) {
          localState.attach = ['material'];
        } else if (is.geometry(threeInstance)) {
          localState.attach = ['geometry'];
        }
      }

      if (injectedRef) injectedRef.nativeElement = threeInstance;

      return threeInstance;
    }

    const element = this.delegateRenderer.createElement(name, namespace);
    this.rendererStateCollection.addDom(element, { ref: injectedRef! });
    return element;
  }

  insertBefore(parent: any, newChild: any, refChild: any, isMove?: boolean): void {
    console.log('insertBefore -->', { parent, newChild, refChild });
    if ((parent as HTMLElement).localName === SPECIAL_TAGS.CANVAS_CONTAINER) {
      this.delegateRenderer.insertBefore(parent, newChild, refChild, isMove);
      return;
    }
    this.appendChild(parent, newChild, true);
  }

  listen(
    target: any,
    eventName: string,
    callback: (event: any) => boolean | void,
    dom?: HTMLElement
  ): () => void {
    const { state, nodeType, threeType } = this.rendererStateCollection.getState(target);
    if (nodeType === 'dom' && !threeType) {
      return this.delegateRenderer.listen(target, eventName, callback);
    }

    if (threeType === 'wrapper') {
      const instance = state.instance;
      if (instance) {
        return this.processThreeEvent(instance, state, eventName, callback, dom);
      }

      queueMicrotask(() => {
        // refetch renderer state
        const { state: refetchState } = this.rendererStateCollection.getState(target);
        const wrapperDom = refetchState.parentDom || refetchState.dom;
        if (refetchState.instance) {
          const { state: instanceState } = this.rendererStateCollection.getState(
            refetchState.instance
          );
          instanceState.cleanUps.add(
            this.listen(instanceState.instance, eventName, callback, wrapperDom as HTMLElement)
          );
        }
      });

      return () => {};
    }

    if (nodeType === 'three') {
      return this.processThreeEvent(target, state, eventName, callback, dom);
    }

    return () => {};
  }

  private processThreeEvent(
    instance: NgtInstanceNode,
    state: NgtRendererState,
    eventName: string,
    callback: (event: any) => boolean | void,
    dom?: HTMLElement
  ) {
    const localState = instanceLocalState(instance);
    if (localState) {
      if (eventName === EVENTS.BEFORE_RENDER) {
        return localState.store
          .get('internal')
          .subscribe(
            (state) => callback({ state, object: instance }),
            localState.priority || 0,
            localState.store
          );
      }

      const previousHandler = localState.handlers[eventName as keyof typeof localState.handlers];
      const updatedCallback: typeof callback = (event) => {
        if (previousHandler) previousHandler(event);
        callback(event);
      };

      if (localState.eventCount) {
        localState.handlers[eventName as keyof typeof localState.handlers] = eventToHandler(
          updatedCallback,
          (dom || state.dom || state.parentDom) as HTMLElement,
          this.rendererStateCollection
        );
      } else {
        localState.handlers = {
          [eventName]: eventToHandler(
            updatedCallback,
            (dom || state.dom || state.parentDom) as HTMLElement,
            this.rendererStateCollection
          ),
        };
      }

      localState.eventCount += 1;

      if (localState.eventCount === 1 && instance['raycast']) {
        localState.store.get('addInteraction')(instance);
      }

      return () => {
        const localState = instanceLocalState(instance);
        if (localState && localState.eventCount) {
          localState.store.get('removeInteraction')(instance['uuid']);
        }
      };
    }

    return () => {};
  }

  parentNode(node: any): any {
    console.log('parentNode -->', { node });
    try {
      const { state, nodeType, threeType } = this.rendererStateCollection.getState(node);
      console.log('parentNode ---->', { state, nodeType, threeType });
      if (state.parentDom) {
        return state.parentDom;
      }

      if (state.parent) {
        return state.parent;
      }

      return this.delegateRenderer.parentNode(node);
    } catch (e) {
      return this.delegateRenderer.parentNode(node);
    }
  }

  removeChild(parent: any, oldChild: any, isHostElement?: boolean): void {
    console.log('removeChild -->', { parent, oldChild });
    // this.delegateRenderer.removeChild(parent, oldChild, isHostElement);
  }

  setAttribute(el: any, name: string, value: string, namespace?: string | null): void {
    console.log('setAttribute -->', { el, name, value });
    const { state, nodeType, threeType } = this.rendererStateCollection.getState(el);

    if (threeType === 'wrapper' && state.instance) {
      this.setAttribute(state.instance, name, value, namespace);
      return;
    }

    if (nodeType === 'three' && threeType === 'normal') {
      const localState = instanceLocalState(el);
      if (name === ATTRIBUTES.BEFORE_RENDER_PRIORITY) {
        // priority needs to be set as an attribute string
        // we then convert that string to number here. invalid number will be default to 0
        let priority = Number(value);
        if (isNaN(priority)) {
          priority = 0;
          console.warn(`[NGT] invalid value for "priority" attribute`);
        }
        localState!.priority = priority;
        return;
      }

      if (name === ATTRIBUTES.ATTACH) {
        // handle attach attribute as string
        // attach can accept a dotted paths
        const paths = value.split('.');
        if (paths.length) localState!.attach = paths;
        return;
      }

      if (name === ATTRIBUTES.WRAPPER_MODE) {
        localState!.wrapper.applyFirst = value === 'first';
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

    this.delegateRenderer.setAttribute(el, name, value, namespace);
  }

  setProperty(el: any, name: string, value: any): void {
    console.log('setProperty -->', { el, name, value });
    const { state, nodeType, threeType } = this.rendererStateCollection.getState(el);
    if (nodeType === 'three') {
      const instance = state.instance;
      const localState = instanceLocalState(instance);

      if (threeType === 'wrapper') {
        // store the props on the instance's localState wrapper
        Object.assign(localState!.wrapper, {
          ...localState!.wrapper,
          props: { ...localState!.wrapper.props, [name]: value },
        });
      }

      /**
       * We reassign the value with the value from wrapper if
       * - the property name is in wrapper.props
       * - if the wrapperMode is 'last' (aka we apply the bindings from the wrapper AFTER we apply the bindings to the instance)
       *   eg:
       *   <ngts-box [position]="[1,2,3]"></ngts-box>
       *   <ngt-mesh [position]="[2,3,4]"></ngt-mesh> --> [2,3,4] takes precedence
       *   <ngt-mesh [position]="[2,3,4]" wrapperMode="last"></ngt-mesh> --> [1,2,3] takes precedence
       */
      if (
        localState &&
        localState.wrapper &&
        localState.wrapper.props &&
        name in localState.wrapper.props &&
        !localState.wrapper.applyFirst
      ) {
        value = localState.wrapper.props[name];
      }

      applyProps(instance, { [name]: value });
      return;
    }
    this.delegateRenderer.setProperty(el, name, value);
  }

  setValue(node: any, value: string): void {
    console.log('setValue -->', { node, value });
    this.delegateRenderer.setValue(node, value);
  }

  get data(): { [p: string]: any } {
    return this.delegateRenderer.data;
  }

  createText(value: string): any {
    return this.delegateRenderer.createText(value);
  }

  removeAttribute(el: any, name: string, namespace?: string | null): void {
    this.delegateRenderer.removeAttribute(el, name, namespace);
  }

  destroyNode(node: any): void {
    this.delegateRenderer.destroyNode?.(node);
  }

  nextSibling(node: any): any {
    return this.delegateRenderer.nextSibling(node);
  }

  addClass(el: any, name: string): void {
    this.delegateRenderer.addClass(el, name);
  }

  removeClass(el: any, name: string): void {
    this.delegateRenderer.removeClass(el, name);
  }

  setStyle(el: any, style: string, value: any, flags?: RendererStyleFlags2): void {
    this.delegateRenderer.setStyle(el, style, value, flags);
  }

  removeStyle(el: any, style: string, flags?: RendererStyleFlags2): void {
    this.delegateRenderer.removeStyle(el, style, flags);
  }

  selectRootElement(selectorOrNode: any, preserveContent?: boolean): any {
    return this.delegateRenderer.selectRootElement(selectorOrNode, preserveContent);
  }

  destroy(): void {
    this.delegateRenderer.destroy();
  }
}

function attachThreeInstances(
  parent: NgtInstanceNode,
  child: NgtInstanceNode,
  parentState: NgtRendererState,
  childState: NgtRendererState,
  rendererStateCollection: NgtRendererStateCollection
) {
  const parentLocalState = instanceLocalState(parent);
  const childLocalState = instanceLocalState(child);

  if (!parentLocalState || !childLocalState) {
    throw new Error(`[NGT] THREE instances need to be prepared with local state.`);
  }

  // whether the child is added to the parent with parent.add()
  let added = false;

  const newChildStore = rendererStateCollection.getStore(childState);
  if (newChildStore && (!childLocalState!.store || childLocalState!.store !== newChildStore)) {
    childLocalState.store = newChildStore;
  }

  const parentStore = rendererStateCollection.getStore(parentState);
  if (parentStore && (!parentLocalState.store || parentLocalState.store !== parentStore)) {
    parentLocalState.store = parentStore;
  }

  if (childLocalState.attach) {
    const attachProp = childLocalState.attach;

    if (typeof attachProp === 'function') {
      const attachCleanUp = (attachProp as NgtAttachFunction)(parent, child, null as any);
      if (attachCleanUp) childLocalState.previousAttach = attachCleanUp;
    } else {
      // we skip attach explicitly
      if (attachProp[0] === 'none') {
        childLocalState.isThree = true;
        invalidateInstance(child);
        return;
      }

      // handle material array
      if (
        attachProp[0] === 'material' &&
        attachProp[1] &&
        typeof Number(attachProp[1]) === 'number' &&
        is.material(child) &&
        !Array.isArray(parent['material'])
      ) {
        parent['material'] = [];
      }

      // attach
      attach(parent, child, attachProp);

      // save value
      childLocalState.previousAttach = attachProp.reduce(
        (value, property) => value[property],
        parent
      );
    }
  } else if (is.object3d(parent) && is.object3d(child)) {
    parent.add(child);
    added = true;
  }

  // This is for anything that used attach, and for non-Object3Ds that don't get attached to props;
  // that is, anything that's a child in React but not a child in the scenegraph.
  if (added) {
    parentLocalState.addObject(child);
  } else {
    parentLocalState.addNonObject(child);
  }

  parentLocalState.isThree = true;

  childLocalState.parent = childState.parent = parent;
  childLocalState.isThree = true;

  invalidateInstance(child);
  invalidateInstance(parent);
}

function removeThreeChild(
  parent: NgtInstanceNode,
  child: NgtInstanceNode,
  rendererStateCollection: NgtRendererStateCollection,
  dispose?: boolean
) {
  const parentLocalState = instanceLocalState(parent);
  const childLocalState = instanceLocalState(child);

  // clear parent ref
  if (childLocalState) childLocalState.parent = null;

  // remove child from parents' objects
  if (parentLocalState?.objects) {
    parentLocalState.removeObject(child);
  }

  if (parentLocalState?.nonObjects) {
    parentLocalState.removeNonObject(child);
  }

  // remove attachment
  if (childLocalState?.attach) {
    detach(parent, child, childLocalState.attach);
  } else if (is.object3d(parent) && is.object3d(child)) {
    parent.remove(child);

    // remove interactivity
    if (childLocalState?.store) {
      removeInteractivity(childLocalState.store, child);
    }
  }

  const isPrimitive = childLocalState?.primitive;
  if (!isPrimitive) {
    removeThreeRecursive(
      childLocalState?.objects.value || [],
      child,
      rendererStateCollection,
      !!dispose
    );
    removeThreeRecursive(child.children, child, rendererStateCollection, !!dispose);
  }

  // remove renderer references
  rendererStateCollection.removeState(child);

  // dispose
  if (child['dispose'] && !is.scene(child)) {
    queueMicrotask(() => child['dispose']());
  }

  invalidateInstance(parent);
}

function removeThreeRecursive(
  array: NgtInstanceNode[],
  parent: NgtInstanceNode,
  rendererStateCollection: NgtRendererStateCollection,
  dispose: boolean
) {
  if (array)
    [...array].forEach((child) =>
      removeThreeChild(parent, child, rendererStateCollection, dispose)
    );
}

function eventToHandler(
  callback: (event: any) => void,
  dom: HTMLElement,
  rendererStateCollection: NgtRendererStateCollection
) {
  const cdr = rendererStateCollection.tryGetCdrFromDom(dom);
  return (
    event: Parameters<Exclude<NgtEventHandlers[typeof supportedEvents[number]], undefined>>[0]
  ) => {
    callback(event);
    cdr?.detectChanges();
  };
}

function kebabToPascal(str: string): string {
  // split the string at each hyphen
  const parts = str.split('-');

  // map over the parts, capitalizing the first letter of each part
  const pascalParts = parts.map((part) => {
    return part.charAt(0).toUpperCase() + part.slice(1);
  });

  // join the parts together to create the final PascalCase string
  return pascalParts.join('');
}

export function provideNgtRenderer(): Provider {
  return { provide: RendererFactory2, useClass: NgtRendererFactory };
}

export function NgtScene(): ClassDecorator {
  return (target) => {
    (target as NgtAnyRecord)[ANNOTATED_FLAGS.NGT_SCENE] = true;
  };
}

export function NgtWrapper(): ClassDecorator {
  return (target) => {
    (target as NgtAnyRecord)[ANNOTATED_FLAGS.NGT_WRAPPER] = true;
  };
}
