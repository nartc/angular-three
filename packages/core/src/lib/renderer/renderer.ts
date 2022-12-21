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
        this.tryAppendDom(childState.parentDom, newChild, fromInsertBefore && newChild.parent);
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
    if ((parent as HTMLElement).localName === SPECIAL_TAGS.CANVAS_CONTAINER) {
      this.delegateRenderer.insertBefore(parent, newChild, refChild, isMove);
      return;
    }
    const { state: refState, nodeType: refNodeType } =
      this.rendererStateCollection.getState(refChild);
    const { state, nodeType } = this.rendererStateCollection.getState(newChild);
    if (refNodeType === 'comment') {
      if (nodeType === 'three') {
        refState.for = state.for || state.instance['type'];
      } else if (nodeType === 'dom') {
        refState.for = state.for || (state.dom as HTMLElement).localName;
      }
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
          .gett((s) => s.internal)
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
        localState.store.gett((s) => s.addInteraction)(instance);
      }

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
    try {
      const { state, nodeType, threeType } = this.rendererStateCollection.getState(node);
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
    const {
      parentState,
      parentNodeType,
      parentThreeType,
      childState,
      childNodeType,
      childThreeType,
      ...rest
    } = this.rendererStateCollection.processParentChild(parent, oldChild);

    if (childNodeType === 'dom') {
      const remove = (dom: HTMLElement) => {
        const children = dom.children;
        let i = children.length - 1;
        while (i >= 0) {
          const child = children.item(i);
          if (!child) {
            i--;
            continue;
          }
          const { state, nodeType } = this.rendererStateCollection.getState(child);
          if (nodeType === 'dom') {
            remove(state.dom as HTMLElement);
            i--;
          } else if (nodeType === 'three') {
            if (childState.parent || parentState.instance) {
              removeThreeChild(
                childState.parent || parentState.instance,
                state.instance,
                this.rendererStateCollection,
                true
              );
            }
            i--;
          }
        }
      };

      remove(childState.dom as HTMLElement);

      if (childState.parentDom) {
        this.delegateRenderer.removeChild(childState.parentDom, oldChild);
        // (childState.parentDom as HTMLElement).removeChild(oldChild);
      }
      return;
    }

    if (childNodeType === 'three') {
      if (parentState.instance) {
        removeThreeChild(
          parentState.instance,
          childState.instance,
          this.rendererStateCollection,
          true
        );
      }
      return;
    }

    this.delegateRenderer.removeChild(parent, oldChild, isHostElement);
  }

  setAttribute(el: any, name: string, value: string, namespace?: string | null): void {
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
    const { state, nodeType } = this.rendererStateCollection.getState(node);
    if (nodeType === 'comment' && state.for) {
      value = value.slice(0, -2).concat(',\n  "ngt-for": ', `"${state.for}"`, '\n}');
    }
    if (node instanceof Comment && node.previousElementSibling) {
      value = value
        .slice(0, -2)
        .concat(',\n  "ngt-for": ', `"${node.previousElementSibling.localName}"`, '\n}');
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
