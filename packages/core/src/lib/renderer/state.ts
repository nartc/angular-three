import { DebugNode, ElementRef, getDebugNode, Type } from '@angular/core';
import { NgtArgs } from '../directives/args';
import { NgtAttachArray } from '../directives/attach-array';
import { NgtAttachFn } from '../directives/attach-fn';
import { NgtRef } from '../directives/ref';
import { NgtStore } from '../store';
import type {
  NgtAttachFunction,
  NgtHasValidateForRenderer,
  NgtInstanceLocalState,
  NgtInstanceNode,
} from '../types';
import { instanceLocalState } from '../utils/instance-local-state';

export class NgtRendererState {
  private readonly debugNodeFactory: () => DebugNode;

  // the THREE instance associated with this RendererState node
  private _instance?: NgtInstanceNode;
  // the parent THREE instance associated with this RendererState node
  private _parent?: NgtInstanceNode;
  // the parent DOM associated with this RendererState node
  private _parentDom?: HTMLElement;

  private _priority = 0;
  private cleanUps = new Set<() => void>();

  private _localState?: NgtInstanceLocalState;
  private _type?: 'scene' | 'wrapper' | 'portal';

  private constructor(
    private _dom: HTMLElement,
    private rendererStateMap: Map<NgtInstanceNode, NgtRendererState>
  ) {
    this.debugNodeFactory = () => getDebugNode(_dom)!;
    rendererStateMap.set(_dom, this);
  }

  // refactoring renderer
  static getOrCreate(dom: HTMLElement, rendererStateMap: Map<NgtInstanceNode, NgtRendererState>) {
    if (rendererStateMap.has(dom)) {
      return rendererStateMap.get(dom) as NgtRendererState;
    }

    return new NgtRendererState(dom, rendererStateMap);
  }

  setType(type: 'scene' | 'wrapper' | 'portal') {
    this._type = type;
  }

  addCleanup(cleanup: () => void) {
    this.cleanUps.add(cleanup);
  }

  getRendererStateOf(of: 'parentDom'): NgtRendererState {
    switch (of) {
      case 'parentDom':
        return this.rendererStateMap.get(this.parentDom)!;
    }
  }

  processParentInstance(): NgtInstanceNode | undefined {
    let parentInstance = this.parent;
    if (!parentInstance) {
      parentInstance = this.rendererStateMap.get(this.parentDom)?.parent;
      if (parentInstance) {
        this.parent = parentInstance;
      }
    }

    return this.parent;
  }

  get dom() {
    return this._dom;
  }

  get parentDom() {
    return this._parentDom;
  }

  set parentDom(v: HTMLElement | undefined) {
    this._parentDom = v;
  }

  /**
   * TODO: come up with better name. In the renderer, we're using "parentRendererState" quite a bit
   */
  get parentRendererState() {
    return this.rendererStateMap.get(this.parentDom);
  }

  get parent() {
    return this._parent;
  }

  set parent(v: NgtInstanceNode) {
    this._parent = v;
  }

  get instance() {
    return this._instance;
  }

  set instance(v: NgtInstanceNode) {
    this._instance = v;
  }

  get instanceLocalState() {
    return instanceLocalState(this.instance);
  }

  get debugNode() {
    return this.debugNodeFactory();
  }

  get priority() {
    return this._priority;
  }

  set priority(v: number) {
    this._priority = v;
  }

  get localState(): NgtInstanceLocalState {
    return this._localState!;
  }

  set localState(v: NgtInstanceLocalState) {
    this._localState = v;
  }

  get isScene() {
    return this._type === 'scene';
  }

  get isWrapper() {
    return this._type === 'wrapper';
  }

  get isPortal() {
    return this._type === 'portal';
  }

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
      const ngtDirective = debugNode?.injector.get(dir, null);
      if (ngtDirective && ngtDirective.validate()) {
        nonInjectedDirective = ngtDirective;
        break;
      }

      i--;
    }

    return nonInjectedDirective;
  }

  tryAssignRootContainer() {
    if (!this.isScene && !this.isPortal) return this;
    const store = this.debugNode.injector.get(NgtStore, null);
    if (store) {
      this.instance = store.get('scene');
      if (this.isPortal && this.parent) {
        // nullify the portal parent scene portal is a separate scene outside of the current Scene Graph
        this.parent = null;
      }
      this.localState.isThree = true;
    }
    return this;
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

  destroy() {
    this.rendererStateMap.delete(this._dom);
    this.cleanUps.forEach((cleanup) => cleanup());
  }
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
