import { ChangeDetectorRef, ElementRef, getDebugNode, Type } from '@angular/core';
import { NgtArgs } from '../directives/args';
import { NgtAttachArray } from '../directives/attach-array';
import { NgtAttachFn } from '../directives/attach-fn';
import { NgtRef } from '../directives/ref';
import { NgtStore } from '../stores/store';
import type { NgtAttachFunction, NgtHasValidateForRenderer, NgtInstanceNode } from '../types';
import { NgtRendererState } from './state';

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
    const scene = store.gett((s) => s.scene);
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
