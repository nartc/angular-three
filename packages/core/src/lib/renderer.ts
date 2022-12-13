import {
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
import type { StoreApi } from 'zustand/vanilla';
import { injectNgtCatalogue } from './catalogue';
import { NgtArgs } from './directives/args';
import { NgtAttachArray } from './directives/attach-array';
import { NgtAttachFn } from './directives/attach-fn';
import { NgtRef } from './directives/ref';
import { NgtStore } from './store';
import type {
  NgtAnyConstructor,
  NgtAnyRecord,
  NgtAttachFunction,
  NgtHasValidateForRenderer,
  NgtInstanceLocalState,
  NgtInstanceNode,
  NgtInstanceRendererState,
  NgtState,
} from './types';
import { applyProps } from './utils/apply-props';
import { attach } from './utils/attach';
import { invalidateInstance } from './utils/instance';
import { instanceLocalState, instanceRendererState } from './utils/instance-local-state';
import { is } from './utils/is';
import { prepare } from './utils/prepare';

const ANNOTATED_FLAGS = {
  NGT_SCENE: '__ngt_scene__',
  NGT_WRAPPER: '__ngt_wrapper__',
} as const;

// ATTRIBUTES
const ATTRIBUTES = {
  BEFORE_RENDER_PRIORITY: 'beforeRenderPriority',
  ATTACH: 'attach',
  WRAPPER_MODE: 'wrapperMode',
} as const;

@Injectable()
export class NgtRendererFactory implements RendererFactory2 {
  private readonly delegateDomRendererFactory = inject(DomRendererFactory);
  private readonly catalogue = injectNgtCatalogue();

  private readonly debugNodeMap = new Map<NgtInstanceNode, DebugNode>();
  private defaultRenderer?: NgtRenderer;

  createRenderer(hostElement: any, type: RendererType2 | null): Renderer2 {
    if (!hostElement || !type) return this.createRendererIfNotExist(hostElement, type);

    console.log('createRenderer -->', { hostElement, type });
    if (!instanceLocalState(hostElement)) hostElement = prepare(hostElement);

    if (!this.debugNodeMap.has(hostElement)) {
      // store the debugNode of this element
      // DebugNode has the Injector that we can use
      this.debugNodeMap.set(hostElement, getDebugNode(hostElement) as DebugNode);
    }

    const componentClass = (type as NgtAnyRecord)['type'];
    const rendererState = { dom: hostElement };

    if (componentClass[ANNOTATED_FLAGS.NGT_SCENE]) {
      Object.assign(rendererState, { scene: true, parentDom: hostElement });
    } else if (componentClass[ANNOTATED_FLAGS.NGT_WRAPPER]) {
      Object.assign(rendererState, { wrapper: true });
    }

    instanceRendererState(hostElement)?.setState((state) => ({ ...state, ...rendererState }));

    return this.createRendererIfNotExist(hostElement, type);
  }
  begin(): void {}
  end(): void {}

  private createRendererIfNotExist(hostElement: any, type: RendererType2 | null): Renderer2 {
    if (!this.defaultRenderer) {
      const delegateRenderer = this.delegateDomRendererFactory.createRenderer(hostElement, type);
      this.defaultRenderer = new NgtRenderer(delegateRenderer, this.debugNodeMap, this.catalogue);
    }
    return this.defaultRenderer;
  }
}

/**
 * 1. Root Scene component, annotated with NgtScene followed by a plain THREE entity
 *    a. createElement (scene or ng-component if no selector)
 *    b. createRenderer (now Angular will try to create the Renderer for this Component)
 *    c. createElement (the THREE entity)
 *    d. appendChild (parent: scene component, child: THREE.Entity)
 *      - step (c) and (d) are repeated for every THREE entity on the template for all of their children as well
 *    e. parentNode (since our root Scene component is always wrapped in *ngtCanvasContent, the "comment" node is always created)
 *    f. insertBefore (ng-canvas-container will now try to insert the scene/ng-component root Scene DOM before the "comment" node)
 */

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
    return this.delegateRenderer.destroy();
  }
  createElement(name: string, namespace?: string | null | undefined) {
    console.log('createElement -->', { name, namespace });
    const threeName = this.kebabToPascal(name);
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

      const instance = prepare(new target(), { isThree: true, attach, args: injectedArgs, store });
      const localState = instanceLocalState(instance) as NgtInstanceLocalState;

      if (is.material(instance)) {
        localState.attach = ['material'];
      } else if (is.geometry(instance)) {
        localState.attach = ['geometry'];
      }

      if (injectedRef) injectedRef.nativeElement = instance;
      return injectedRef?.nativeElement || instance;
    }

    const element = this.delegateRenderer.createElement(name, namespace);
    return prepare(element);
  }
  createComment(value: string) {
    console.log('createComment -->', { value });
    const comment = this.delegateRenderer.createComment(value);
    prepare(comment);
    instanceRendererState(comment)?.setState({ dom: comment });
    return comment;
  }

  createText(value: string) {
    console.log('createText -->', { value });
    return this.delegateRenderer.createText(value);
  }

  destroyNode!: ((node: any) => void) | null;

  appendChild(parent: any, newChild: any): void {
    console.log('appendChild -->', { parent, newChild, debugNodeMap: this.debugNodeMap });

    let parentRendererState = instanceRendererState(parent) as StoreApi<NgtInstanceRendererState>;
    let parentLocalState = instanceLocalState(parent) as NgtInstanceLocalState;
    let childRendererState = instanceRendererState(newChild);
    let childLocalState = instanceLocalState(newChild);

    // Scene component might not have the Scene instance set. Let's try to do it here
    this.tryAssignRootScene(parentRendererState);

    // Try to update our debugNodeMap so that the child at least knows about its parent DebugNode
    this.tryAssignDebugNode(parent, newChild);

    // if parent is the root scene, let's reassign it
    if (parentRendererState.getState().scene) {
      const sceneDom = parent;
      if (childRendererState) childRendererState.setState({ parentDom: sceneDom });
      parent = parentRendererState.getState().instance;
      parentRendererState = instanceRendererState(parent) as StoreApi<NgtInstanceRendererState>;
      parentLocalState = instanceLocalState(parent) as NgtInstanceLocalState;

      if (!parentRendererState.getState().dom) parentRendererState.setState({ dom: sceneDom });
    }

    // if both parent and newChild are THREE, proceed with custom logic
    if (is.three(parent) && is.three(newChild)) {
      // whether the child is added to the parent with parent.add()
      let added = false;

      if (!childLocalState) {
        prepare(newChild, { isThree: true, store: this.getStore(newChild) });
        childLocalState = instanceLocalState(newChild) as NgtInstanceLocalState;
        childRendererState = instanceRendererState(newChild) as StoreApi<NgtInstanceRendererState>;
      }

      const newChildStore = this.getStore(newChild);
      if (newChildStore && (!childLocalState.store || childLocalState.store !== newChildStore)) {
        childLocalState.store = newChildStore;
      }

      const parentStore = this.getStore(parent);
      if (parentStore && (!parentLocalState.store || parentLocalState.store !== parentStore)) {
        parentLocalState.store = parentStore;
      }

      if (childLocalState?.attach) {
        const attachProp = childLocalState.attach;

        if (typeof attachProp === 'function') {
          const attachCleanUp = (attachProp as NgtAttachFunction)(parent, newChild, null as any);
          if (attachCleanUp) childLocalState.previousAttach = attachCleanUp;
        } else {
          // we skip attach explicitly
          if (attachProp[0] === 'none') {
            childLocalState.isThree = true;
            invalidateInstance(newChild);
            return;
          }

          // handle material array
          if (
            attachProp[0] === 'material' &&
            attachProp[1] &&
            typeof Number(attachProp[1]) === 'number' &&
            is.material(newChild) &&
            !Array.isArray(parent['material'])
          ) {
            parent['material'] = [];
          }

          // attach
          attach(parent, newChild, attachProp);

          // save value
          childLocalState.previousAttach = attachProp.reduce(
            (value, property) => value[property],
            parent
          );
        }
      } else if (is.object3d(parent) && is.object3d(newChild)) {
        parent.add(newChild);
        added = true;
      }

      // This is for anything that used attach, and for non-Object3Ds that don't get attached to props;
      // that is, anything that's a child in React but not a child in the scenegraph.
      const collection = added ? parentLocalState.objects : parentLocalState.nonObjects;
      collection.setState((state) => [
        ...(Array.isArray(state) ? state : Object.values(state)),
        newChild,
      ]);

      childLocalState!.parent = parent;
      childLocalState!.isThree = true;
      childRendererState!.setState({ parent });
      parentLocalState!.isThree = true;

      invalidateInstance(newChild);
      invalidateInstance(parent);

      return;
    }

    if (is.html(parent) && is.html(newChild)) {
      // since both are HTMLs, we'll try set everything that we can set
      // then delegate the parent and child to the DomRenderer
      if (
        !childRendererState?.getState().parentDom &&
        (parentRendererState.getState().dom || parentRendererState.getState().parentDom)
      ) {
        childRendererState?.setState({
          parentDom: parentRendererState.getState().dom || parentRendererState.getState().parentDom,
        });
      }

      if (
        !childRendererState?.getState().parent &&
        (parentRendererState?.getState().instance || parentRendererState?.getState().parent)
      ) {
        childRendererState?.setState({
          parent:
            parentRendererState?.getState().instance || parentRendererState?.getState().parent,
        });
      }

      this.delegateRenderer.appendChild(parent, newChild);
      return;
    }

    if (is.three(parent) && is.html(newChild)) {
      // TODO: Determine if we need to prepare the child

      // Set the parent instance (THREE object) on the child instance (DOM element)
      childRendererState?.setState({ parent });

      // Since parent is a THREE object, we can check if there's a parentDom on it.
      // if there's not, we will try to find the closest parent DOM from debugNodeMap
      if (!parentRendererState.getState().parentDom) {
        const domParentFromDebugNodeMap = this.tryGetDomParent(parent);
        if (domParentFromDebugNodeMap) {
          parentRendererState.setState({ parentDom: domParentFromDebugNodeMap });
        }
      }

      // if there is, and the child doesn't already have a parentDom, we'll set it
      if (parentRendererState.getState().parentDom && !childRendererState?.getState().parentDom) {
        childRendererState?.setState({ parentDom: parentRendererState.getState().parentDom });
      }

      // append the child on the parentDom
      if (
        is.scene(parent) ||
        instanceRendererState(childRendererState?.getState().parentDom)?.getState().scene
      ) {
        this.delegateRenderer.appendChild(childRendererState?.getState().parentDom, newChild);
      } else {
        if (childRendererState?.getState().parentDom) {
          this.appendChild(childRendererState?.getState().parentDom, newChild);
        }
      }

      // if on the child doesn't have any THREE instance, we bail
      if (!is.three(childRendererState?.getState().instance)) return;

      // if there is, append it to the parent
      this.appendChild(parent, childRendererState?.getState().instance);
      return;
    }

    if (is.html(parent) && is.three(newChild)) {
      // set the parentDom of the child to be parent
      childRendererState?.setState({ parentDom: parent });

      if (
        parentRendererState.getState().parentDom &&
        (parent as HTMLElement).parentElement !== parentRendererState.getState().parentDom
      ) {
        this.delegateRenderer.appendChild(parentRendererState.getState().parentDom, parent);
      }

      // there are cases where, with structural directives, the DOM parent
      // has no information about its parent (due to ng-template)
      // we'll try to walk the DebugNodeMap to find the closest parent
      if (!parentRendererState.getState().parent) {
        const parentFromDebugNodeMap = this.tryGetThreeParent(parent);
        if (!parentFromDebugNodeMap) return;

        parentRendererState.setState({ parent: parentFromDebugNodeMap });
      }

      // the DOM parent can also be a wrapper, if it is, the instance should be set
      if (parentRendererState.getState().wrapper) {
        parentRendererState.setState({ instance: newChild });
      }

      this.appendChild(parentRendererState.getState().parent, newChild);
      return;
    }

    // none of the cases match, let's delegate
    this.delegateRenderer.appendChild(parent, newChild);
  }
  insertBefore(parent: any, newChild: any, refChild: any, isMove?: boolean | undefined): void {
    console.log('insertBefore -->', { parent, newChild, refChild, isMove });

    // Where the root scene component is being added to the ngt-canvas-container (eg: router-outlet)
    // after the first render cycle of all staytic elements on the templates (eg: no ngIf, no structural directives, no bindings)
    if (is.html(parent) && (parent as HTMLElement).nodeName === 'NGT-CANVAS-CONTAINER') {
      this.delegateRenderer.insertBefore(parent, newChild, refChild, isMove);
      return;
    }

    const parentRendererState = instanceRendererState(parent);
    const childRendererState = instanceRendererState(newChild);
    const refChildRendererState = instanceRendererState(refChild);

    // if new child is a three object, appendChild will handle it
    if (is.three(newChild)) {
      if (is.html(refChild)) childRendererState?.setState({ dom: refChild });
      if (is.html(parent)) childRendererState?.setState({ parentDom: parent });
      this.appendChild(parent, newChild);
      return;
    }

    // we'll let the DomRenderer handles the case where refChild.parentDom is found
    // and it's different than the current child parentDom
    if (
      refChildRendererState?.getState().parentDom &&
      refChildRendererState?.getState().parentDom !== childRendererState?.getState().parentDom
    ) {
      childRendererState?.setState({ parentDom: refChildRendererState?.getState().parentDom });
      this.delegateRenderer.insertBefore(
        childRendererState?.getState().parentDom,
        newChild,
        refChild,
        isMove
      );
    }

    // we also check if parent is an instance (wrapper)
    // if it is, we'll delegate to appendChild
    if (is.three(parentRendererState?.getState().instance)) {
      this.appendChild(parentRendererState?.getState().instance, newChild);
      return;
    }

    // otherwise, delegate to DomRenderer
    this.delegateRenderer.insertBefore(parent, newChild, refChild, isMove);
  }

  // TODO: this needs work
  removeChild(parent: any, oldChild: any, isHostElement?: boolean | undefined): void {
    console.log('removeChild -->', { parent, oldChild, isHostElement });
    this.delegateRenderer.removeChild(parent, oldChild, isHostElement);
  }
  selectRootElement(selectorOrNode: any, preserveContent?: boolean | undefined) {
    console.log('selectRootElement -->', { selectorOrNode, preserveContent });
    return this.delegateRenderer.selectRootElement(selectorOrNode, preserveContent);
  }
  parentNode(node: any) {
    console.log('parentNode -->', { node });
    const nodeRendererState = instanceRendererState(node);
    if (nodeRendererState) {
      return (
        nodeRendererState.getState().parent ||
        nodeRendererState.getState().parentDom ||
        this.delegateRenderer.parentNode(node)
      );
    }
    return this.delegateRenderer.parentNode(node);
  }
  nextSibling(node: any) {
    console.log('nextSibling -->', { node });
    return this.delegateRenderer.nextSibling(node);
  }
  setAttribute(el: any, name: string, value: string, namespace?: string | null | undefined): void {
    const rendererState = instanceRendererState(el);

    if (rendererState?.getState().wrapper) {
      this.setAttribute(rendererState.getState().instance, name, value, namespace);
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
        rendererState?.setState({ beforeRenderPriority: priority });
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
        if (localState) {
          if (!localState.wrapper) {
            localState.wrapper = { props: {}, applyFirst: value === 'first' };
          }
          localState.wrapper.applyFirst = value === 'first';
        }
        return;
      }

      applyProps(el, { [name]: value });
      return;
    }

    this.delegateRenderer.setAttribute(el, name, value, namespace);
  }
  removeAttribute(el: any, name: string, namespace?: string | null | undefined): void {
    console.log('removeAttribute -->', { el, name, namespace });
    this.delegateRenderer.removeAttribute(el, name, namespace);
  }
  addClass(el: any, name: string): void {
    console.log('addClass -->', { el, name });
    this.delegateRenderer.addClass(el, name);
  }
  removeClass(el: any, name: string): void {
    console.log('removeClass -->', { el, name });
    this.delegateRenderer.removeClass(el, name);
  }
  setStyle(el: any, style: string, value: any, flags?: RendererStyleFlags2 | undefined): void {
    console.log('setStyle -->', { el, style, value, flags });
    this.delegateRenderer.setStyle(el, style, value, flags);
  }
  removeStyle(el: any, style: string, flags?: RendererStyleFlags2 | undefined): void {
    console.log('removeStyle -->', { el, style, flags });
    this.delegateRenderer.removeStyle(el, style, flags);
  }
  setProperty(el: any, name: string, value: any): void {
    console.log('setProperty -->', { el, name, value });
    this.delegateRenderer.setProperty(el, name, value);
  }
  setValue(node: any, value: string): void {
    console.log('setValue -->', { node, value });
    this.delegateRenderer.setValue(node, value);
  }
  listen(target: any, eventName: string, callback: (event: any) => boolean | void): () => void {
    console.log('listen -->', { target, eventName, callback });
    return this.delegateRenderer.listen(target, eventName, callback);
  }

  private tryAssignRootScene(rendererState: StoreApi<NgtInstanceRendererState>) {
    if (rendererState && rendererState.getState().scene && !rendererState.getState().instance) {
      const debugNode = this.getDebugNodeForInstance(rendererState.getState());
      const ngtStore = debugNode.injector.get(NgtStore, null, { skipSelf: true });
      if (ngtStore) {
        const instance = ngtStore.store.getState().scene;
        rendererState.setState({ instance });
        this.debugNodeMap.set(instance, debugNode);
      }
    }
  }

  private tryAssignDebugNode(parent: any, child: any) {
    const childRendererState = instanceRendererState(child);

    if (!childRendererState) return;

    // if the child instance already be tracked in the debugNodeMap, bail out
    if (this.debugNodeMap.has(childRendererState.getState().instance)) return;
    const childDebugNode = this.getDebugNodeForInstance(childRendererState.getState());
    // if we have the debugNode for the child, which means we find it on the dom of the child
    // then we add a record of the same debugNode for the child instance
    if (childDebugNode && childRendererState.getState().instance) {
      this.debugNodeMap.set(childRendererState.getState().instance, childDebugNode);
      return;
    }

    // at this point, we cannot find any debug node for the child. Let's try the parent
    const parentRendererState = instanceRendererState(parent);
    if (!parentRendererState) return;
    const parentDebugNode = this.getDebugNodeForInstance(parentRendererState.getState());
    if (!parentDebugNode) return;

    let debugNode = is.html(child) ? getDebugNode(child) : undefined;

    if (!debugNode || debugNode === parentDebugNode) {
      debugNode = parentDebugNode;
    }

    // add a record for the child dom
    if (childRendererState.getState().dom) {
      this.debugNodeMap.set(childRendererState.getState().dom, debugNode);
    }

    // add a record for the child instance
    if (childRendererState.getState().instance) {
      this.debugNodeMap.set(childRendererState.getState().instance, debugNode);
    }
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

  private getStore(instance: any) {
    const localState = instanceLocalState(instance);
    const rendererState = instanceRendererState(instance);
    if (!localState || !rendererState) return;

    const debugNode = this.getDebugNodeForInstance(rendererState.getState());
    if (!debugNode) return;
    return debugNode.injector.get(NgtStore).store;
  }

  // TODO: hack
  private tryGetThreeParent(parent: any) {
    const debugNodeKeys = Array.from(this.debugNodeMap.keys());
    const parentDebugNodeIndex = debugNodeKeys.findIndex((key) => key === parent);
    if (parentDebugNodeIndex <= 0) return;

    let previousDebugNodeKeyIndex = parentDebugNodeIndex - 1;
    let threeParent: NgtInstanceNode | undefined;

    while (previousDebugNodeKeyIndex >= 1 && !threeParent) {
      const previousDebugNodeKey = debugNodeKeys[previousDebugNodeKeyIndex];
      const previousNodeRendererState = instanceRendererState(previousDebugNodeKey);
      if (is.html(previousDebugNodeKey)) {
        threeParent =
          previousNodeRendererState?.getState().instance ||
          previousNodeRendererState?.getState().parent;
      } else if (is.three(previousDebugNodeKey)) {
        threeParent = previousDebugNodeKey;
      }

      previousDebugNodeKeyIndex -= 1;
    }

    return threeParent;
  }

  // TODO: hack
  private tryGetDomParent(instance?: any) {
    const debugNodeKeys = Array.from(this.debugNodeMap.keys());
    let debugNodeIndex =
      instance && this.debugNodeMap.has(instance)
        ? debugNodeKeys.findIndex((key) => key === instance)
        : debugNodeKeys.length - 1;

    if (debugNodeIndex < 0) return;

    let domParent: HTMLElement | undefined;
    while (!domParent && debugNodeIndex >= 0) {
      const debugNodeKey = debugNodeKeys[debugNodeIndex];
      const debugNodeRendererState = instanceRendererState(debugNodeKey);
      if (is.three(debugNodeKey)) {
        domParent =
          debugNodeRendererState?.getState().dom || debugNodeRendererState?.getState().parentDom;
      } else if (is.html(debugNodeKey)) {
        domParent =
          (debugNodeKey as NgtInstanceNode) instanceof HTMLElement ? debugNodeKey : undefined;
      }

      debugNodeIndex -= 1;
    }

    return domParent;
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
