import {
  ChangeDetectorRef,
  DebugNode,
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
import type { StoreApi } from 'zustand';
import { injectNgtCatalogue } from './catalogue';
import { NgtArgs } from './directives/args';
import { NgtAttachArray } from './directives/attach-array';
import { NgtAttachFn } from './directives/attach-fn';
import { NgtRef } from './directives/ref';
import { supportedEvents } from './events';
import { NgtStore } from './store';
import type {
  NgtAnyConstructor,
  NgtAnyRecord,
  NgtAttachFunction,
  NgtEventHandlers,
  NgtHasValidateForRenderer,
  NgtInstanceNode,
  NgtInstanceRendererState,
  NgtState,
} from './types';
import { applyProps } from './utils/apply-props';
import { attach, detach } from './utils/attach';
import { removeInteractivity } from './utils/events';
import { invalidateInstance } from './utils/instance';
import { instanceLocalState, instanceRendererState } from './utils/instance-local-state';
import { is } from './utils/is';
import { prepare } from './utils/prepare';

const ANNOTATED_FLAGS = {
  NGT_SCENE: '__ngt_scene__',
  NGT_WRAPPER: '__ngt_wrapper__',
} as const;

const ATTRIBUTES = {
  BEFORE_RENDER_PRIORITY: 'beforeRenderPriority',
  ATTACH: 'attach',
  WRAPPER_MODE: 'wrapperMode',
} as const;

const EVENTS = {
  BEFORE_RENDER: 'beforeRender',
} as const;

@Injectable()
export class NgtRendererFactory implements RendererFactory2 {
  private readonly delegateDomRendererFactory = inject(DomRendererFactory);
  private readonly catalogue = injectNgtCatalogue();

  private readonly debugNodeMap = new Map<NgtInstanceNode, DebugNode>();
  private defaultRenderer?: NgtRenderer;

  createRenderer(hostElement: any, type: RendererType2 | null): Renderer2 {
    if (!hostElement || !type) return this.createRendererIfNotExist(hostElement, type);

    if (!instanceLocalState(hostElement)) hostElement = prepare(hostElement);

    if (!this.debugNodeMap.has(hostElement)) {
      // store the debugNode of this element
      // DebugNode has the Injector that we can use
      this.debugNodeMap.set(hostElement, getDebugNode(hostElement) as DebugNode);
    }

    const componentClass = (type as NgtAnyRecord)['type'];
    const state = { dom: hostElement };

    if (componentClass[ANNOTATED_FLAGS.NGT_SCENE]) {
      Object.assign(state, { scene: true, parentDom: hostElement });
    } else if (componentClass[ANNOTATED_FLAGS.NGT_WRAPPER]) {
      Object.assign(state, { wrapper: true });
    }

    const rendererState = instanceRendererState(hostElement);
    if (rendererState) {
      Object.assign(rendererState, state);
    }

    return this.createRendererIfNotExist(hostElement, type);
  }
  begin(): void {}
  end(): void {}

  private createRendererIfNotExist(hostElement: any, type: RendererType2 | null): Renderer2 {
    if (!this.defaultRenderer) {
      const delegateRenderer = this.delegateDomRendererFactory.createRenderer(hostElement, type);
      this.defaultRenderer = new NgtRenderer(delegateRenderer, this.debugNodeMap, this.catalogue);
      // this.defaultRenderer = new NgtRenderer(delegateRenderer);
    }
    return this.defaultRenderer;
  }
}

export class NgtRenderer implements Renderer2 {
  constructor(
    private delegateRenderer: Renderer2,
    private debugNodeMap: Map<NgtInstanceNode, DebugNode>,
    private catalogue: Record<string, NgtAnyConstructor>
  ) {}

  get data(): { [key: string]: any } {
    return this.delegateRenderer.data;
  }
  destroy(): void {
    this.delegateRenderer.destroy();
  }
  createElement(name: string, namespace?: string | null | undefined) {
    const element = prepare(this.delegateRenderer.createElement(name, namespace));

    const threeTag = name.startsWith('ngt') && !name.startsWith('ngts') ? name.slice(4) : name;
    const threeName = this.kebabToPascal(threeTag);
    const target = this.catalogue[threeName];

    if (target) {
      /**
       * Assuming the following template:
       * <box-geometry *args="[2, 2, 2]"></box-geometry>
       *
       * The reason that it works is that:
       * - When we have the Structural Directive, Angular will create a comment <!-- container -->
       * on the DOM in place of the <ng-template> that Structural Directive has
       * - In the Renderer, we can intercept this process (in appendChild()) and store the DebugNode
       * of this Comment instance. Hence, we'll have access to the NgtArgs instance in the Injector
       * - By the time we get to the actual THREE object that needs the "args", the DebugNode is ready
       * to be used as the Injector.
       */
      const ngtArgs = this.firstNonInjectedDirective(NgtArgs);
      const ngtRef = this.firstNonInjectedDirective(NgtRef);
      const ngtAttachFn = this.firstNonInjectedDirective(NgtAttachFn);
      const ngtAttachArray = this.firstNonInjectedDirective(NgtAttachArray);

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
        this.tryGetStoreFromDebugNodeMap();

      const instance = prepare(
        new target(...injectedArgs),
        {
          store,
          isThree: true,
          args: injectedArgs,
          attach,
        },
        { dom: element }
      );
      const localState = instanceLocalState(instance);

      if (is.material(instance)) {
        localState!.attach = ['material'];
      } else if (is.geometry(instance)) {
        localState!.attach = ['geometry'];
      }

      const elementLocalState = instanceLocalState(element);

      if (elementLocalState) {
        elementLocalState.isThree = true;
        if (store) elementLocalState.store = store;
      }

      const elementRendererState = instanceRendererState(element);

      if (injectedRef) injectedRef.nativeElement = instance;
      if (elementRendererState) {
        elementRendererState.instance = injectedRef?.nativeElement || instance;
      }
    }

    return element;
  }
  createComment(value: string) {
    return prepare(this.delegateRenderer.createComment(value));
  }
  createText(value: string) {
    console.log('createText -->', { value });
    return this.delegateRenderer.createText(value);
  }
  destroyNode!: ((node: any) => void) | null;
  appendChild(parent: any, newChild: any, fromInsertBefore = false): void {
    const parentRendererState = instanceRendererState(parent);
    const childRendererState = instanceRendererState(newChild);

    // Scene component might not have the Scene instance set. Let's try to do it here
    this.tryAssignRootScene(parentRendererState);

    // Try to update our debugNodeMap so that the child at least knows about its parent DebugNode
    this.tryAssignDebugNode(parent, newChild);

    // let the DOM renderer does its thing
    // but if we call appendChild manually from insertBefore, don't do it
    if (!fromInsertBefore) {
      this.delegateRenderer.appendChild(parent, newChild);
    }

    // assign the parentDom
    if (childRendererState) {
      childRendererState.parentDom = parent;
    }

    if (parentRendererState?.wrapper && !parentRendererState?.instance) {
      parentRendererState.instance = childRendererState?.instance;

      let parentInstance = parentRendererState.parent;
      if (!parentInstance) {
        parentInstance = instanceRendererState(parentRendererState.parentDom)?.parent;
        if (parentInstance) {
          parentRendererState.parent = parentInstance;
        }
      }

      if (parentRendererState.parent) {
        this.attachThreeInstances(parentRendererState.parent, parentRendererState.instance);
        childRendererState!.parent = parentRendererState.parent;
      }
      return;
    }

    if (childRendererState && !childRendererState.parent && parentRendererState?.instance) {
      childRendererState.parent = parentRendererState.instance;
    }

    if (!childRendererState?.instance) {
      // this might be the indicator that this is a regular Angular component
      // we then can loop over its HTMLChildren
      // TODO: this might be a case for a recusive algo
      const grandChildren = Array.from((newChild as HTMLElement).children || []);
      for (const grandChild of grandChildren) {
        const grandChildRendererState = instanceRendererState(grandChild);
        if (!grandChildRendererState || !grandChildRendererState.instance) continue;
        this.attachThreeInstances(childRendererState?.parent, grandChildRendererState.instance);
      }
      return;
    }

    if (
      childRendererState?.instance &&
      parentRendererState?.instance &&
      parentRendererState.instance !== childRendererState.instance
    ) {
      this.attachThreeInstances(parentRendererState.instance, childRendererState.instance);
    }
  }
  insertBefore(parent: any, newChild: any, refChild: any, isMove?: boolean | undefined): void {
    this.delegateRenderer.insertBefore(parent, newChild, refChild, isMove);
    if ((parent as HTMLElement).nodeName === 'NGT-CANVAS-CONTAINER') return;
    this.appendChild(parent, newChild, true);
  }
  removeChild(parent: any, oldChild: any, isHostElement?: boolean | undefined): void {
    const parentRendererState = instanceRendererState(parent);
    const childRendererState = instanceRendererState(oldChild);

    // if a child doesn't have any instance
    // it might be an indicator where this is an Angular component
    // that renders other stuffs instead of being a THREE entity OR a NgtWrapper
    if (!childRendererState?.instance) {
      // if this is the case, we'll loop over its' children HTML to determine
      // TODO: this might be a case for a recusive algo
      const grandChildren = Array.from((oldChild as HTMLElement).children || []);
      for (const grandChild of grandChildren) {
        const grandChildRendererState = instanceRendererState(grandChild);
        if (!grandChildRendererState || !grandChildRendererState.instance) continue;
        this.removeThreeChild(
          childRendererState?.parent || parentRendererState?.instance,
          grandChildRendererState.instance
        );
      }
    }

    if (parentRendererState?.instance && childRendererState?.instance) {
      this.removeThreeChild(parentRendererState.instance, childRendererState.instance, true);
    }

    this.removeRendererReferences(oldChild);
    this.delegateRenderer.removeChild(parent, oldChild, isHostElement);
  }
  selectRootElement(selectorOrNode: any, preserveContent?: boolean | undefined) {
    return this.delegateRenderer.selectRootElement(selectorOrNode, preserveContent);
  }
  parentNode(node: any) {
    return this.delegateRenderer.parentNode(node);
  }
  nextSibling(node: any) {
    return this.delegateRenderer.nextSibling(node);
  }
  setAttribute(el: any, name: string, value: string, namespace?: string | null | undefined): void {
    const rendererState = instanceRendererState(el);

    if (rendererState?.wrapper) {
      this.setAttribute(rendererState.instance, name, value, namespace);
      return;
    }

    if (is.three(el)) {
      const localState = instanceLocalState(el);
      if (name === ATTRIBUTES.BEFORE_RENDER_PRIORITY) {
        // priority needs to be set as an attribute string
        // we convert that string to number here. invalid number will be default to 0
        let priority = Number(value);
        if (isNaN(priority)) {
          priority = 0;
          console.warn(`[NGT] Invalid value for "beforeRenderPriority", default to 0`);
        }
        rendererState!.beforeRenderPriority = priority;
        return;
      }

      if (name === ATTRIBUTES.ATTACH) {
        // handle attach attribute as string
        // attach can be passed as dotted paths
        const paths = value.split('.');
        if (paths.length && localState) localState.attach = paths;
        return;
      }

      if (name === ATTRIBUTES.WRAPPER_MODE) {
        if (localState) localState.wrapper.applyFirst = value === 'first';
        return;
      }

      applyProps(el, { [name]: value });
      return;
    }

    this.delegateRenderer.setAttribute(el, name, value, namespace);
    if (rendererState?.instance) {
      this.setAttribute(rendererState?.instance, name, value, namespace);
    }
  }
  removeAttribute(el: any, name: string, namespace?: string | null | undefined): void {
    this.delegateRenderer.removeAttribute(el, name, namespace);
  }
  addClass(el: any, name: string): void {
    this.delegateRenderer.addClass(el, name);
  }
  removeClass(el: any, name: string): void {
    this.delegateRenderer.removeClass(el, name);
  }
  setStyle(el: any, style: string, value: any, flags?: RendererStyleFlags2 | undefined): void {
    this.delegateRenderer.setStyle(el, style, value, flags);
  }
  removeStyle(el: any, style: string, flags?: RendererStyleFlags2 | undefined): void {
    this.delegateRenderer.removeStyle(el, style, flags);
  }
  setProperty(el: any, name: string, value: any): void {
    const rendererState = instanceRendererState(el);

    if (rendererState?.instance) {
      const instance = rendererState.instance;
      const localState = instanceLocalState(instance);

      if (rendererState.wrapper) {
        // store the props on the instance's localState.wrapper
        Object.assign(localState!.wrapper, {
          ...localState!.wrapper,
          props: { ...localState!.wrapper.props, [name]: value },
        });
      }

      /**
       * we ressign the value with the value from wrapper if
       * - the property name is in the wrapper.props
       * - if the wrapperMode is 'last' (aka we apply the bindings from the wrapper AFTER we apply the bindings on the element)
       * eg:
       * <ngts-box [position]="[1,2,3]"></ngts-box>
       * <ngt-mesh [position]="[2,3,4]"></ngt-mesh> -> [2,3,4] takes precedence
       * <ngt-mesh wrapperMode="last" [position]="[2,3,4]"></ngt-mesh> -> [1,2,3] takes precedence
       */
      if (
        localState?.wrapper &&
        localState.wrapper.props &&
        name in localState.wrapper.props &&
        !localState.wrapper.applyFirst
      ) {
        value = localState.wrapper.props[name];
      }

      applyProps(instance, { [name]: value });
    }

    this.delegateRenderer.setProperty(el, name, value);
  }
  setValue(node: any, value: string): void {
    if (node instanceof Comment && node.previousElementSibling) {
      value = value
        .slice(0, -2)
        .concat(',\n  "ngt-for": ', `"${node.previousElementSibling.localName}"`, '\n}');
    }
    this.delegateRenderer.setValue(node, value);
  }
  listen(
    target: any,
    eventName: string,
    callback: (event: any) => boolean | void,
    dom?: HTMLElement
  ): () => void {
    let rendererState = instanceRendererState(target);
    let instance = rendererState?.instance;
    const localState = instanceLocalState(instance);

    if (instance && localState) {
      // handling beforeRender
      if (eventName === EVENTS.BEFORE_RENDER) {
        return localState.store
          .getState()
          .internal.subscribe(
            (state) => callback({ state, object: instance }),
            rendererState?.beforeRenderPriority ?? 0,
            localState.store
          );
      }

      const previousHandler = localState.handlers[eventName as keyof typeof localState.handlers];
      const updatedCallback: typeof callback = (event) => {
        if (previousHandler) previousHandler(event);
        callback(event);
      };

      if (localState.eventCount) {
        localState.handlers[eventName as keyof typeof localState.handlers] = this.eventToHandler(
          updatedCallback,
          (dom || rendererState?.dom || rendererState?.parentDom) as HTMLElement
        );
      } else {
        localState.handlers = {
          [eventName]: this.eventToHandler(
            updatedCallback,
            (dom || rendererState?.dom || rendererState?.parentDom) as HTMLElement
          ),
        };
      }
      localState.eventCount += 1;

      if (localState?.eventCount === 1 && instance['raycast']) {
        localState.store.getState().addInteraction(instance);
      }

      return () => {
        const localState = instanceLocalState(instance);
        if (localState?.eventCount) {
          localState.store.getState().removeInteraction(instance['uuid']);
        }
      };
    }

    if (!instance && rendererState?.wrapper) {
      queueMicrotask(() => {
        // refetch rendererState
        rendererState = instanceRendererState(target);
        const wrapperDom = rendererState?.parentDom || rendererState?.dom;
        instance = rendererState?.instance;

        if (instance) {
          // re-assign rendererState to be instance
          rendererState = instanceRendererState(instance);
          rendererState?.cleanUps?.add(
            this.listen(rendererState.dom, eventName, callback, wrapperDom)
          );
        }
      });

      return () => {};
    }

    return this.delegateRenderer.listen(target, eventName, callback);
  }

  private removeThreeChild(parent: NgtInstanceNode, child: NgtInstanceNode, dispose?: boolean) {
    if (child) {
      const parentLocalState = instanceLocalState(parent);
      const childLocalState = instanceLocalState(child);

      // clear parent ref
      if (childLocalState) childLocalState.parent = null;

      // remove child from parents' objects
      if (parentLocalState?.objects) {
        parentLocalState.objects.setState(
          this.toArray(parentLocalState.objects).filter((x) => x !== child)
        );
      }

      if (parentLocalState?.nonObjects) {
        parentLocalState.nonObjects.setState(
          this.toArray(parentLocalState.nonObjects).filter((x) => x !== child)
        );
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
        this.removeThreeRecursive(this.toArray(childLocalState?.objects), child, !!dispose);
        this.removeThreeRecursive(child.children, child, !!dispose);
      }

      // Remove references
      if (childLocalState) {
        delete child.__ngt__.store;
        delete child.__ngt__.objects;
        delete child.__ngt__.handlers;
        delete child.__ngt__.memoized;
        if (!isPrimitive) delete child.__ngt__;
      }

      // remove renderer references
      this.removeRendererReferences(child);

      // dispose
      if (child['dispose'] && !is.scene(child)) {
        queueMicrotask(() => child['dispose']());
      }

      invalidateInstance(parent);
    }
  }

  private removeRendererReferences(target: NgtInstanceNode) {
    const rendererState = instanceRendererState(target);
    if (rendererState) {
      rendererState.cleanUps?.forEach((cleanUp) => cleanUp());
      this.debugNodeMap.delete(rendererState.dom);
      delete target.__ngt_renderer__.cleanUps;
      delete target.__ngt_renderer__.scene;
      delete target.__ngt_renderer__.wrapper;
      delete target.__ngt_renderer__.instance;
      delete target.__ngt_renderer__.parent;
      delete target.__ngt_renderer__.dom;
      delete target.__ngt_renderer__.parentDom;
      delete target.__ngt_renderer__.beforeRenderPriority;
    }
  }

  private removeThreeRecursive(
    array: NgtInstanceNode[],
    parent: NgtInstanceNode,
    dispose: boolean
  ) {
    if (array) [...array].forEach((child) => this.removeThreeChild(parent, child, dispose));
  }

  private toArray<T>(arrayStore?: StoreApi<T[]>): T[] {
    if (!arrayStore) return [];
    const state = arrayStore.getState();
    return Array.isArray(state) ? state : Object.values(state);
  }

  private tryAssignRootScene(rendererState?: NgtInstanceRendererState) {
    if (rendererState && rendererState.scene && !rendererState.instance) {
      const debugNode = this.getDebugNodeForInstance(rendererState);
      const ngtStore = this.getStore(rendererState);
      if (ngtStore) {
        const instance = ngtStore.getState().scene;
        rendererState.instance = instance;
        this.debugNodeMap.set(instance, debugNode);
        const localState = instanceLocalState(rendererState.dom);
        if (localState) localState.isThree = true;
      }
    }
  }

  private tryAssignDebugNode(parent: any, child: any) {
    const childRendererState = instanceRendererState(child);
    if (!childRendererState) return;

    // if the child instance already be tracked in the debugNodeMap, bail out
    if (this.debugNodeMap.has(childRendererState.instance)) return;
    const childDebugNode = this.getDebugNodeForInstance(childRendererState);
    // if we have the debugNode for the child, which means we find it on the dom of the child
    // then we add a record of the same debugNode for the child instance
    if (childDebugNode && childRendererState.instance) {
      this.debugNodeMap.set(childRendererState.instance, childDebugNode);
      return;
    }

    // at this point, we cannot find any debug node for the child. Let's try the parent
    const parentRendererState = instanceRendererState(parent);
    if (!parentRendererState) return;
    const parentDebugNode = this.getDebugNodeForInstance(parentRendererState);
    if (!parentDebugNode) return;

    let debugNode = is.html(child) ? getDebugNode(child) : undefined;

    if (!debugNode || debugNode === parentDebugNode) {
      debugNode = parentDebugNode;
    }

    // add a record for the child dom
    if (childRendererState.dom) {
      this.debugNodeMap.set(childRendererState.dom, debugNode);
    }

    // add a record for the child instance
    if (childRendererState.instance) {
      this.debugNodeMap.set(childRendererState.instance, debugNode);
    }
  }

  private tryGetStoreFromDebugNodeMap() {
    let store: StoreApi<NgtState> | undefined = undefined;
    this.debugNodeMap.forEach((debugNode) => {
      const ngtStore = debugNode.injector.get(NgtStore, null);
      if (ngtStore && ngtStore.store) {
        store = ngtStore.store;
        return;
      }
    });
    return store;
  }

  private getStore(rendererState: NgtInstanceRendererState): StoreApi<NgtState> | undefined {
    if (!rendererState) return;

    const debugNode = this.getDebugNodeForInstance(rendererState);
    if (!debugNode) return;
    return debugNode.injector.get(NgtStore, null, { skipSelf: true })?.store;
  }

  private getDebugNodeForInstance(rendererState: NgtInstanceRendererState): DebugNode {
    let debugNode =
      this.debugNodeMap.get(rendererState.instance) || this.debugNodeMap.get(rendererState.dom);

    if (!debugNode) {
      debugNode =
        this.debugNodeMap.get(rendererState.parent) ||
        this.debugNodeMap.get(rendererState.parentDom);
    }

    return debugNode as DebugNode;
  }

  // TODO: this is a hack. we need a better guarantee
  private firstNonInjectedDirective<T extends NgtHasValidateForRenderer>(
    directive: Type<T>
  ): T | undefined {
    let nonInjectedDirective: T | undefined;

    this.debugNodeMap.forEach((debugNode) => {
      const ngtDirective = debugNode.injector.get(directive, null);
      if (ngtDirective && ngtDirective.validate()) {
        nonInjectedDirective = ngtDirective;
        return;
      }
    });

    return nonInjectedDirective;
  }

  private attachThreeInstances(parent: NgtInstanceNode, child: NgtInstanceNode) {
    const parentLocalState = instanceLocalState(parent);
    const childRendererState = instanceRendererState(child);
    const childLocalState = instanceLocalState(child);

    // whether the child is added to the parent with parent.add()
    let added = false;

    const newChildStore = this.getStore(childRendererState!);
    if (newChildStore && (!childLocalState!.store || childLocalState!.store !== newChildStore)) {
      childLocalState!.store = newChildStore;
    }

    const parentStore = this.getStore(parent);
    if (parentStore && (!parentLocalState!.store || parentLocalState!.store !== parentStore)) {
      parentLocalState!.store = parentStore;
    }

    if (childLocalState?.attach) {
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
    const collection = added ? parentLocalState!.objects : parentLocalState!.nonObjects;
    collection.setState([...this.toArray(collection), child]);

    childLocalState!.parent = childRendererState!.parent = parent;
    childLocalState!.isThree = parentLocalState!.isThree = true;

    invalidateInstance(child);
    invalidateInstance(parent);
  }

  private eventToHandler(callback: (event: any) => void, dom: HTMLElement) {
    const cdr = this.closestCdr(dom);
    return (
      event: Parameters<Exclude<NgtEventHandlers[typeof supportedEvents[number]], undefined>>[0]
    ) => {
      callback(event);
      cdr?.detectChanges();
    };
  }

  private get lastDebugNode(): DebugNode | undefined {
    return Array.from(this.debugNodeMap.values()).pop();
  }

  private closestCdr(domElement?: HTMLElement): ChangeDetectorRef | undefined {
    const debugNode = domElement ? this.debugNodeMap.get(domElement) : this.lastDebugNode;
    return debugNode?.injector.get(ChangeDetectorRef);
  }

  private kebabToPascal(str: string): string {
    // split the string at each hyphen
    const parts = str.split('-');

    // map over the parts, capitalizing the first letter of each part
    const pascalParts = parts.map((part) => {
      return part.charAt(0).toUpperCase() + part.slice(1);
    });

    // join the parts together to create the final PascalCase string
    return pascalParts.join('');
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
