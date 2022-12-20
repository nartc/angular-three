import { DebugNode, ElementRef, getDebugNode, Type } from '@angular/core';
import { NgtArgs } from '../directives/args';
import { NgtAttachArray } from '../directives/attach-array';
import { NgtAttachFn } from '../directives/attach-fn';
import { NgtRef } from '../directives/ref';
import { NgtStore } from '../store';
import type {
  NgtAnyRecord,
  NgtAttachFunction,
  NgtHasValidateForRenderer,
  NgtInstanceLocalState,
  NgtInstanceNode,
} from '../types';

export class RendererState {
  private readonly children = new Set<RendererState>();
  private debugNodeFactory: () => DebugNode;
  private parentState?: RendererState;

  constructor(
    private instance: NgtInstanceNode,
    private localState: NgtInstanceLocalState,
    private rendererStateMap: Map<NgtInstanceNode, RendererState>,
    private type?: 'scene' | 'wrapper' | 'portal'
  ) {
    this.debugNodeFactory = () => getDebugNode(instance)!;
    rendererStateMap.set(instance, this);
  }

  static init(
    instance: NgtInstanceNode,
    localState: NgtInstanceLocalState,
    rendererStateMap: Map<NgtInstanceNode, RendererState>,
    type?: 'scene' | 'wrapper' | 'portal'
  ): RendererState {
    if (rendererStateMap.has(instance)) {
      return rendererStateMap.get(instance) as RendererState;
    }

    return new RendererState(instance, localState, rendererStateMap, type);
  }

  upsertChild(child: RendererState) {
    if (!this.children.has(child)) {
      child.parentState = this;
      this.children.add(child);
    }
  }

  setType(type: 'scene' | 'wrapper' | 'portal') {
    this.type = type;
  }

  getInitPhaseStates(): {
    injectedArgs: any[];
    injectedRef?: ElementRef | null;
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

    return { injectedArgs, injectedRef, attach, store };
  }

  tryAssignRootScene() {
    const store = this.debugNode.injector.get(NgtStore, null);
    if (store) {
      const rendererState = this.rendererStateMap.get(this.instance)!;
      const scene = store.get('scene');
      (scene as NgtAnyRecord)['__ngContext__'] = this.instance['__ngContext__'];
      this.rendererStateMap.delete(this.instance);
      this.instance = scene;
      this.rendererStateMap.set(this.instance, rendererState);
    }

    return this.rendererStateMap.get(this.instance)!;
  }

  replace(newInstance: NgtInstanceNode) {
    const oldInstance = this.instance;
    const rendererState = this.rendererStateMap.get(oldInstance)!;
    this.rendererStateMap.delete(this.instance);
    this.debugNodeFactory = () => getDebugNode(oldInstance)!;
    this.instance = newInstance;
    this.rendererStateMap.set(this.instance, rendererState);
  }

  get instanceNode() {
    return this.instance;
  }

  get parentNode() {
    return this.parentState?.instanceNode;
  }

  get debugNode() {
    return this.debugNodeFactory();
  }

  get instanceLocalState() {
    return this.localState;
  }

  get isScene() {
    return this.type === 'scene';
  }

  get isWrapper() {
    return this.type === 'wrapper';
  }

  get isPortal() {
    return this.type === 'portal';
  }

  private firstNonInjectedDirective<T extends NgtHasValidateForRenderer>(
    dir: Type<T>
  ): T | undefined {
    let nonInjectedDirective: T | undefined;

    const states = Array.from(this.rendererStateMap.values());

    let i = states.length - 1;
    while (i >= 0) {
      // loop through the states to find the directive
      // we loop backwards because the latest added node is the closest one to the element
      const debugNode = states[i].debugNode;
      const ngtDirective = debugNode.injector.get(dir, null);
      if (ngtDirective && ngtDirective.validate()) {
        nonInjectedDirective = ngtDirective;
        break;
      }

      i--;
    }

    return nonInjectedDirective;
  }

  private tryGetStore() {
    let store: NgtStore | undefined = undefined;

    const states = Array.from(this.rendererStateMap.values());

    let i = states.length - 1;
    while (i >= 0) {
      // loop through the states to find the store
      // we loop backwards because the latest added node is the closest one to the element
      const debugNode = states[i].debugNode;
      const ngtStore = debugNode?.injector.get(NgtStore, null);
      if (ngtStore) {
        store = ngtStore;
        break;
      }

      i--;
    }

    return store;
  }

  /*private tryAssignRootScene(rendererState?: NgtInstanceRendererState) {
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
  }*/
}

/**
 * scene?: boolean;
 *   wrapper?: boolean;
 *   portal?: boolean;
 *   instance: NgtInstanceNode;
 *   parent: NgtInstanceNode | null;
 *   dom?: HTMLElement;
 *   parentDom?: HTMLElement;
 *   beforeRenderPriority?: number;
 *   cleanUps?: Set<() => void>;
 */
