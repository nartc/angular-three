import { ChangeDetectorRef, ElementRef, getDebugNode, Injector, Type } from '@angular/core';
import type { Scene } from 'three';
import { NgtArgs } from '../directives/args';
import { NgtAttachArray } from '../directives/attach-array';
import { NgtAttachFn } from '../directives/attach-fn';
import { NgtRef } from '../directives/ref';
import { NgtStore } from '../stores/store';
import type {
  NgtAnyRecord,
  NgtAttachFunction,
  NgtHasValidateForRenderer,
  NgtInstanceNode,
} from '../types';

export interface NgtRendererRoot {
  scene: Scene;
  dom: HTMLElement;
  glDom: HTMLCanvasElement;
  store: NgtStore;
  cdr: ChangeDetectorRef;
}

export interface NgtRendererState<TInstance extends HTMLElement | Comment = HTMLElement> {
  type: 'comment' | 'portal' | 'dom';
  parent?: NgtAnyRecord;
  instance: TInstance;
  injectorFactory: () => Injector;
  unprocessedThreeChildren: NgtInstanceNode[];
  parentStateFactory?: () => NgtRendererState;
  dispose: () => void;
}

export interface NgtCompoundState extends Omit<NgtRendererState, 'type'> {
  type: 'compound';
  inputs: string[];
  cleanUps: Set<() => void>;
}

export class NgtRendererStateCollection {
  private readonly commentMap = new Map<Comment, NgtRendererState<Comment>>();
  private readonly portalMap = new Map<HTMLElement, NgtRendererState>();
  private readonly compoundMap = new Map<HTMLElement, NgtCompoundState>();
  private readonly domMap = new Map<HTMLElement, NgtRendererState>();

  readonly #root: NgtRendererRoot;

  constructor(root: NgtRendererRoot) {
    this.#root = root;
  }

  addComment(
    comment: Comment,
    state: Partial<Omit<NgtRendererState<Comment>, 'type' | 'dispose'>>
  ) {
    return this.#internalAdd(this.commentMap, comment, { ...state, type: 'comment' });
  }

  addPortal(portal: HTMLElement, state: Partial<Omit<NgtRendererState, 'type' | 'dispose'>>) {
    return this.#internalAdd(this.portalMap, portal, { ...state, type: 'portal' });
  }

  addCompound(
    compound: HTMLElement,
    state: Partial<Omit<NgtCompoundState, 'type' | 'cleanUps' | 'dispose'>>
  ) {
    if (this.domMap.has(compound)) {
      const oldState = this.domMap.get(compound)!;
      if (!state.parent) {
        state.parent = oldState.parent;
      }
      if (!state.injectorFactory) {
        state.injectorFactory = oldState.injectorFactory;
      }
      if (!state.parentStateFactory) {
        state.parentStateFactory = oldState.parentStateFactory;
      }
      if (!state.unprocessedThreeChildren?.length) {
        state.unprocessedThreeChildren = oldState.unprocessedThreeChildren;
      }
      this.domMap.delete(compound);
    }
    const compoundState = {
      ...state,
      type: 'compound',
      inputs: state.inputs || [],
      cleanUps: new Set(),
    } as NgtCompoundState;

    compoundState.dispose = () => {
      compoundState.cleanUps.forEach((cleanUp) => cleanUp());
      compoundState.cleanUps.clear();
    };

    return this.#internalAdd(this.compoundMap, compound, compoundState);
  }

  addDom(dom: HTMLElement, state: Partial<Omit<NgtRendererState, 'type' | 'dispose'>>) {
    return this.#internalAdd(this.domMap, dom, { ...state, type: 'dom' });
  }

  get(obj: any): NgtRendererState<Comment> | NgtRendererState | NgtCompoundState {
    return (this.commentMap.get(obj) ||
      this.domMap.get(obj) ||
      this.compoundMap.get(obj) ||
      this.portalMap.get(obj))!;
  }

  get root(): NgtRendererRoot {
    return this.#root;
  }

  getCreationState(): {
    injectedArgs: any[];
    store: NgtStore;
    injectedRef?: ElementRef<NgtInstanceNode> | null;
    attach?: string[] | NgtAttachFunction;
  } {
    const ngtArgs = this.#firstNonInjectedDirective(NgtArgs);
    const ngtRef = this.#firstNonInjectedDirective(NgtRef);
    const ngtAttachArray = this.#firstNonInjectedDirective(NgtAttachArray);
    const ngtAttachFn = this.#firstNonInjectedDirective(NgtAttachFn);

    const injectedArgs = ngtArgs?.args || [];
    const injectedRef = ngtRef?.ref;

    const injectedAttachFn = ngtAttachFn?.attachFn;
    const injectedAttachArray = ngtAttachArray?.attachArray;

    const attach = injectedAttachFn || injectedAttachArray || undefined;
    const store = this.#tryGetPortalStore();

    return { injectedArgs, injectedRef, attach, store };
  }

  #firstNonInjectedDirective<T extends NgtHasValidateForRenderer>(dir: Type<T>): T | undefined {
    let dirInstance: T | undefined;
    // we only care about the comment states because structural directives create Comments
    const commentState = Array.from(this.commentMap.values());
    let i = commentState.length - 1;
    while (i >= 0) {
      // loop through the comment state backwards to find the directive
      const injector = commentState[i].injectorFactory?.();
      if (!injector) {
        i--;
        continue;
      }
      const instance = injector.get(dir, null);
      if (instance && instance.validate()) {
        dirInstance = instance;
        break;
      }
      i--;
    }
    return dirInstance;
  }

  #tryGetPortalStore(): NgtStore {
    let store: NgtStore | undefined;
    // we only care about the portal states because NgtStore only differs per Portal
    const portalState = Array.from(this.portalMap.values());
    let i = portalState.length - 1;
    while (i >= 0) {
      // loop through the portal state backwards to find the closest NgtStore
      const injector = portalState[i].injectorFactory?.();
      if (!injector) {
        i--;
        continue;
      }
      const instance = injector.get(NgtStore, null);
      if (instance) {
        store = instance;
        break;
      }
      i--;
    }
    return store || this.root.store;
  }

  #internalAdd<
    TMap extends Map<any, any>,
    TInstance = TMap extends Map<infer T, NgtRendererState> ? T : never,
    TRendererState = TMap extends Map<any, infer T> ? T : never
  >(map: TMap, obj: TInstance, state: Partial<TRendererState>): TRendererState {
    if (!map.has(obj)) {
      const originalDispose = (state as NgtAnyRecord)['dispose'];
      const dispose = () => {
        originalDispose?.();
        const rS = map.get(obj);
        delete rS.instance;
        delete rS.parent;
        delete rS.injectorFactory;
        delete rS.parentStateFactory;
        delete rS.unprocessedThreeChildren;
        map.delete(obj);
      };

      map.set(obj, {
        ...state,
        injectorFactory: () => getDebugNode(obj)!.injector,
        instance: obj,
        unprocessedThreeChildren: [],
        dispose,
      });
    }
    return map.get(obj)!;
  }
}
