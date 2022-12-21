import {
  inject,
  Injectable,
  Provider,
  Renderer2,
  RendererFactory2,
  RendererStyleFlags2,
  RendererType2,
} from '@angular/core';
import { ɵDomRendererFactory2 as DomRendererFactory } from '@angular/platform-browser';
import { injectNgtCatalogue } from '../catalogue';
import type { NgtAnyConstructor, NgtAnyRecord, NgtInstanceNode } from '../types';
import { applyProps } from '../utils/apply-props';
import { instanceLocalState } from '../utils/instance-local-state';
import { is } from '../utils/is';
import { prepare } from '../utils/prepare';
import { NgtRendererStateCollection } from './renderer-state-collection';
import { NgtRendererState } from './state';
import { attachThreeInstances, eventToHandler, kebabToPascal, removeThreeChild } from './utils';

const ANNOTATED_FLAGS = {
  NGT_SCENE: '__ngt_scene__',
  NGT_WRAPPER: '__ngt_wrapper__',
} as const;

const ATTRIBUTES = {
  BEFORE_RENDER_PRIORITY: 'priority',
  ATTACH: 'attach',
  WRAPPER_MODE: 'wrapperMode',
  NO_WRAP: 'noWrap',
} as const;

const EVENTS = {
  BEFORE_RENDER: 'beforeRender',
} as const;

const SPECIAL_TAGS = {
  PORTAL: 'ngt-portal',
  PRIMITIVE: 'ngt-primitive',
  CANVAS_CONTAINER: 'ngt-canvas-container',
} as const;

@Injectable()
export class NgtRendererFactory implements RendererFactory2 {
  private readonly delegateDomRendererFactory = inject(DomRendererFactory);
  private readonly catalogue = injectNgtCatalogue();
  private readonly rendererStateCollection = new NgtRendererStateCollection();
  private defaultRenderer?: NgtRenderer;

  createRenderer(hostElement: any, type: RendererType2 | null): Renderer2 {
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

/**
 * This Renderer handles both DOM and THREE instances:
 * - For DOM instances, the Renderer calculates whether it is a Compound/Wrapper around THREE objects
 * or it is a regular Angular component.
 * - For THREE instances, the Renderer returns the THREE instances directly.
 */
export class NgtRenderer implements Renderer2 {
  constructor(
    private delegateRenderer: Renderer2,
    private rendererStateCollection: NgtRendererStateCollection,
    private catalogue: Record<string, NgtAnyConstructor>
  ) {}

  appendChild(parent: any, newChild: any, fromInsertBefore = false): void {
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

    // handling a DOM child. If its parent is a THREE instance, we'll store that information
    // we also store the parentDom as well
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
        // we'll try to append the dom if it satisfies the condition
        this.tryAppendDom(childState.parentDom, newChild, fromInsertBefore && newChild.parent);
      }
      return;
    }

    // handling Comment nodes. These comments are created by Structural Directives.
    // Due to Angular Renderer limitation, we keep track of these Comments and their DebugNode
    // so that we can inject the Structural Directives assigned to them later.
    if (childNodeType === 'comment') {
      // store the parent THREE instance if available
      if (!childState.parent && parentState.instance) {
        childState.parent = parentState.instance;
      }

      // if the immediate parent doesn't have a THREE instance, try look for the grand parent
      if (!childState.parent && !parentState.instance && parentState.parent) {
        childState.parent = parentState.parent;
      }

      // try to append the Comment node to a parent DOM node depending on the parent type.
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

    // handling THREE instances
    if (childNodeType === 'three') {
      // if parent node is a wrapper, it is initially a DOM type.
      if (parentThreeType === 'wrapper') {
        let useParentInstance = false;
        // this is the EARLIEST place where we can say: "hey, you wrap this THREE instance. You are now this THREE instance"
        // and we only do so if the child specifies "noWrap = false"
        if (parentNodeType === 'dom' && !childState.noWrap) {
          parentState.instance = newChild;
          // here, we switch the nodeType from 'dom' to 'three'
          parentState.nodeType = 'three';

          // if the consumers use *ref on a wrapper, we handle it here
          if (parentState.ref) {
            parentState.ref.nativeElement = newChild;
          }

          useParentInstance = true;
        }
        if (!parentState.instance) throw new Error(`[NGT] fail to append child to THREE wrapper`);
        childState.parentDom = parent;
        childState.debugNodeFactory = () => parentState.debugNodeFactory!();
        // child is a THREE instance so we will handle this based on whether we already have the Wrapper instance
        if (useParentInstance && parentState.parent) {
          this.appendChild(parentState.parent, newChild);
        } else if (parentState.instance && parentState.instance !== newChild) {
          this.appendChild(parentState.instance, newChild);
        }
        return;
      }

      // if parent node is a 'dom' and child is 'wrapper' then we'll append the DOM nodes
      // else we'll append the THREE instances
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

      // if parent is THREE, straightforward, we just call our logic to attach the THREE instances
      if (parentNodeType === 'three') {
        if (childThreeType === 'wrapper') {
          newChild = childState.instance;
        }

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
    shouldAppend = false
  ) {
    if (!shouldAppend) {
      this.delegateRenderer.appendChild(parentDom, childDom);
    }
  }

  // create the comment normally and store it
  createComment(value: string): any {
    const comment = this.delegateRenderer.createComment(value);
    this.rendererStateCollection.addComment(comment);
    return comment;
  }

  createElement(name: string, namespace?: string | null): any {
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
      this.rendererStateCollection.addThree(threeInstance, { threeType: 'normal', for: threeName });

      const localState = instanceLocalState(threeInstance)!;
      // for three instances, default material and geometry attach if it's not already existed
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
    // this is the parent <ngt-canvas-container>, we don't care in the Renderer
    if ((parent as HTMLElement).localName === SPECIAL_TAGS.CANVAS_CONTAINER) {
      this.delegateRenderer.insertBefore(parent, newChild, refChild, isMove);
      return;
    }

    const { state: refState, nodeType: refNodeType } =
      this.rendererStateCollection.getState(refChild);
    const { state, nodeType } = this.rendererStateCollection.getState(newChild);

    // little funsie, we "enhance" the comment's value so we know what the structural directive is for
    if (refNodeType === 'comment') {
      if (nodeType === 'three') {
        refState.for = state.for || state.instance['type'];
      } else if (nodeType === 'dom') {
        refState.for = state.for || (state.dom as HTMLElement).localName;
      }
    }

    // TODO: it was late when I wrote this. I don't understand. Investigate further when problem arises
    if (Array.isArray(parent)) {
      const [parentThree, parentDom] = parent;

      if (nodeType === 'dom') {
        this.appendChild(parentThree || parentDom, newChild, true);
      } else if (nodeType === 'three') {
        this.appendChild(parentDom || parentThree, newChild, true);
      }

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
    // if the target is just a DOM, we let Angular handles it
    if (nodeType === 'dom' && !threeType) {
      return this.delegateRenderer.listen(target, eventName, callback);
    }

    if (threeType === 'wrapper') {
      // wrapper instance might be late.
      // if we have instance, we process the events
      const instance = state.instance;
      if (instance) {
        return this.processThreeEvent(instance, state, eventName, callback, dom);
      }

      // else, we queue the events listeners
      queueMicrotask(() => {
        // refetch renderer state
        const { state: refetchState } = this.rendererStateCollection.getState(target);
        const wrapperDom = refetchState.parentDom || refetchState.dom;
        if (refetchState.instance) {
          const { state: instanceState } = this.rendererStateCollection.getState(
            refetchState.instance
          );
          // this.listen returns a clean up function. we'll store this function to clean up later
          instanceState.cleanUps.add(
            this.listen(instanceState.instance, eventName, callback, wrapperDom as HTMLElement)
          );
        }
      });

      return () => {};
    }

    // if it's just THREE, process the events
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
        // beforeRender is special event, we'll handle it here
        // TODO: what happens if both wrapper and three have beforeRender
        return localState.store
          .gett((s) => s.internal)
          .subscribe(
            (state) => callback({ state, object: instance }),
            localState.priority || 0,
            localState.store
          );
      }

      // try to get the previous handler. wrapper might have one, the THREE object might also have one with the same name
      const previousHandler = localState.handlers[eventName as keyof typeof localState.handlers];
      // readjust the callback
      const updatedCallback: typeof callback = (event) => {
        if (previousHandler) previousHandler(event);
        callback(event);
      };

      // if we have eventCount, which means we already setup handlers
      if (localState.eventCount) {
        // process the event with ChangeDetectorRef
        localState.handlers[eventName as keyof typeof localState.handlers] = eventToHandler(
          updatedCallback,
          (dom || state.dom || state.parentDom) as HTMLElement,
          this.rendererStateCollection
        );
      } else {
        // no eventCount, first time setting up handlers
        localState.handlers = {
          [eventName]: eventToHandler(
            updatedCallback,
            (dom || state.dom || state.parentDom) as HTMLElement,
            this.rendererStateCollection
          ),
        };
      }

      // increment the count everytime
      localState.eventCount += 1;

      // but only add the instance (target) to the interaction array (so that it is handled by the EventManager with Raycast)
      // the first time eventCount is incremented
      if (localState.eventCount === 1 && instance['raycast']) {
        localState.store.gett((s) => s.addInteraction)(instance);
      }

      // clean up the event listener by removing the target from the interaction array
      return () => {
        const localState = instanceLocalState(instance);
        if (localState && localState.eventCount) {
          localState.store.gett((s) => s.removeInteraction)(instance['uuid']);
        }
      };
    }

    return () => {};
  }

  parentNode(node: any): any {
    // we try/catch this because the initial comment (created by <router-outlet> and <ngt-canvas-container>) doesn't have
    // RendererState because NgtRenderer doesn't handle that comment specifically
    try {
      const { state } = this.rendererStateCollection.getState(node);

      // if a comment have both parent and parentDom, returns as an Array. We handle array in removeChild and insertBefore
      if (state.parent && state.parentDom) {
        return [state.parent, state.parentDom];
      }

      if (state.parent) {
        return state.parent;
      }

      if (state.parentDom) {
        return state.parentDom;
      }

      return this.delegateRenderer.parentNode(node);
    } catch (e) {
      return this.delegateRenderer.parentNode(node);
    }
  }

  // TODO: again, wrote when late. Investigate further when problem arises
  removeChild(parent: any, oldChild: any, isHostElement?: boolean): void {
    if (Array.isArray(parent)) {
      this.removeChild(parent[0], oldChild, isHostElement);
      this.removeChild(parent[1], oldChild, isHostElement);
      return;
    }

    try {
      const { nodeType: childNodeType } = this.rendererStateCollection.getState(oldChild);

      try {
        const { state: parentState, nodeType: parentNodeType } =
          this.rendererStateCollection.getState(parent);

        if (childNodeType === 'dom') {
          // Angular component because wrapper and three would have nodeType of 'three'
          if (parentNodeType === 'dom') {
            this.delegateRenderer.removeChild(parent, oldChild, isHostElement);
            return;
          }

          if (parentNodeType === 'three') {
            // here we'll try to loop through oldChild's children DOM
            const domChildren = (oldChild as HTMLElement).children;
            let i = domChildren.length - 1;
            while (i >= 0) {
              const domChild = domChildren.item(i);
              if (!domChild) {
                i--;
                continue;
              }
              const { state, nodeType } = this.rendererStateCollection.getState(domChild);
              if (nodeType !== 'three') {
                i--;
                continue;
              }
              removeThreeChild(parent, state.instance, this.rendererStateCollection, true);
              i--;
            }
          }
          return;
        }

        if (childNodeType === 'three') {
          if (parentNodeType === 'three') {
            removeThreeChild(parentState.instance, oldChild, this.rendererStateCollection, true);
          }
          return;
        }

        this.delegateRenderer.removeChild(parent, oldChild, isHostElement);
      } catch (e) {
        this.delegateRenderer.removeChild(parent, oldChild, isHostElement);
      }
    } catch (e) {
      // ignore error. this is because child is being referenced twice and on the 2nd run
      // it has already been removed
    }
  }

  setAttribute(el: any, name: string, value: string, namespace?: string | null): void {
    const { state, nodeType, threeType } = this.rendererStateCollection.getState(el);

    // if el is a wrapper and it has instance, recall setAttribute with the instance
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

      if (name === ATTRIBUTES.NO_WRAP) {
        state.noWrap = true;
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

  // setValue is called when Angular sets value for the Comment nodes
  setValue(node: any, value: string): void {
    const { state, nodeType } = this.rendererStateCollection.getState(node);
    // we do a little fun stuffs here
    if (nodeType === 'comment' && state.for) {
      value = value.slice(0, -2).concat(',\n  "ngt-for": ', `"${state.for}"`, '\n}');
    }
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
    // TODO: should we use this for removing THREE instead?
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
