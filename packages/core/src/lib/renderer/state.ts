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
import { getLocalState } from '../utils/instance';
import { removeThreeChild } from './utils';

export interface NgtRendererRoot {
  scene: Scene;
  dom: HTMLElement;
  glDom: HTMLCanvasElement;
  store: NgtStore;
  cdr: ChangeDetectorRef;
}

export class NgtRendererStateCollection {
  private readonly domThreeMap = new Map<HTMLElement, NgtInstanceNode>();
  private readonly domMap = new Map<
    HTMLElement,
    { isCompound?: boolean; rawValue?: any; attach?: string[] | NgtAttachFunction }
  >();
  private readonly threeMap = new Map<
    NgtInstanceNode,
    {
      priority: number;
      compound?: { applyFirst: boolean; props: Record<string, any> };
      compoundParent?: HTMLElement;
    }
  >();
  private readonly compoundMap = new Map<
    HTMLElement,
    { inputs: string[]; cleanUps: Set<() => void>; queueOps: Set<() => void> }
  >();
  private readonly commentMap = new Map<Comment, { injectorFactory: () => Injector }>();
  private readonly portalMap = new Map<HTMLElement, { injectorFactory: () => Injector }>();

  constructor(public readonly root: NgtRendererRoot) {}

  addDomThree(dom: HTMLElement, three: NgtInstanceNode) {
    if (!this.domThreeMap.has(dom)) this.domThreeMap.set(dom, three);
    Object.assign(dom, { __ngt_three__: three });
    return this.domThreeMap.get(dom)!;
  }

  addDom(dom: HTMLElement) {
    if (!this.domMap.has(dom)) this.domMap.set(dom, { isCompound: false });
    return this.domMap.get(dom)!;
  }

  addPortal(dom: HTMLElement) {
    if (!this.portalMap.has(dom))
      this.portalMap.set(dom, { injectorFactory: () => getDebugNode(dom)!.injector });
    return this.portalMap.get(dom)!;
  }

  addThree(
    three: NgtInstanceNode,
    partial?: {
      priority?: number;
      compound?: { applyFirst?: boolean; props?: Record<string, any> };
      compoundParent?: HTMLElement;
    }
  ) {
    if (!this.threeMap.has(three)) {
      const state: NgtAnyRecord = { priority: 0 };
      if (partial?.compound) {
        state['compound'] = { applyFirst: true, props: {}, ...partial.compound };
      }
      if (partial?.compoundParent) {
        state['compoundParent'] = partial.compoundParent;
      }
      this.threeMap.set(three, state as any);
    }
    return this.threeMap.get(three)!;
  }

  addCompound(dom: HTMLElement, partial?: { inputs?: string[] }) {
    if (!this.compoundMap.has(dom)) {
      const state: NgtAnyRecord = { inputs: [], cleanUps: new Set(), queueOps: new Set() };
      if (partial?.inputs) {
        state['inputs'] = partial.inputs;
      }
      this.compoundMap.set(dom, state as any);
    }
    return this.compoundMap.get(dom)!;
  }

  addComment(comment: Comment) {
    if (!this.commentMap.has(comment))
      this.commentMap.set(comment, { injectorFactory: () => getDebugNode(comment)!.injector });
    return this.commentMap.get(comment)!;
  }

  removeComment(comment: Comment) {
    const commentState = this.commentMap.get(comment);
    if (commentState) {
      commentState.injectorFactory = undefined!;
    }
    this.commentMap.delete(comment);
  }

  getThree(dom: HTMLElement) {
    return this.domThreeMap.get(dom);
  }

  getGrandParentThree(parent: HTMLElement) {
    let grandParent = parent.parentNode as HTMLElement;
    if (!grandParent) return [] as any[];
    let grandParentThree = this.getThree(grandParent);
    while (!grandParentThree) {
      grandParent = grandParent.parentNode as HTMLElement;
      if (!grandParent) break;
      grandParentThree = this.getThree(grandParent);
    }
    return [grandParent, grandParentThree];
  }

  getPortal(dom: HTMLElement) {
    return this.portalMap.get(dom);
  }

  getDom(dom: HTMLElement) {
    return this.domMap.get(dom);
  }

  getThreeOptions(three: NgtInstanceNode) {
    return this.threeMap.get(three);
  }

  getCompoundOptions(dom: HTMLElement) {
    return this.compoundMap.get(dom);
  }

  getTargetFlags(el: HTMLElement): {
    isThree: boolean;
    isCompoundNoInstance: boolean;
    isCompoundWithInstance: boolean;
  } {
    const three = this.getThree(el);
    const domOptions = this.getDom(el);
    return {
      isThree: three && !domOptions,
      isCompoundNoInstance: !three && !!domOptions?.isCompound,
      isCompoundWithInstance: three && !!domOptions?.isCompound,
    };
  }

  removeDomState(target: HTMLElement | Comment) {
    if (target instanceof Comment) {
      const commentState = this.commentMap.get(target);
      if (commentState) {
        delete (commentState as NgtAnyRecord)['injectorFactory'];
      }
      this.commentMap.delete(target);
      return;
    }

    if (this.domMap.has(target)) {
      this.domMap.delete(target);
    }

    if (this.compoundMap.has(target)) {
      const compoundOptions = this.compoundMap.get(target)!;
      compoundOptions.cleanUps.forEach((cleanUp) => cleanUp());
      compoundOptions.cleanUps.clear();
      delete (compoundOptions as NgtAnyRecord)['cleanUps'];
      compoundOptions.queueOps.clear();
      delete (compoundOptions as NgtAnyRecord)['queueOps'];
      delete (compoundOptions as NgtAnyRecord)['inputs'];
      this.compoundMap.delete(target);
    }

    if (this.domThreeMap.has(target)) {
      delete this.domThreeMap.get(target)!['__ngt_three__'];
      this.domThreeMap.delete(target);
    }
  }

  removeThreeState(three: NgtInstanceNode) {
    const threeOptions = this.threeMap.get(three);
    if (threeOptions) {
      delete (threeOptions as NgtAnyRecord)['priority'];
      delete (threeOptions as NgtAnyRecord)['compound'];
      delete (threeOptions as NgtAnyRecord)['compoundParent'];
    }
    this.threeMap.delete(three);
    const localState = getLocalState(three);
    if (localState) {
      if (localState.objects) {
        const objects = localState.objects.value;
        objects.forEach((obj) => this.removeThreeState(obj));
        localState.objects.complete();
      }

      if (localState.nonObjects) {
        const nonObjects = localState.nonObjects.value;
        nonObjects.forEach((obj) => this.removeThreeState(obj));
        localState.nonObjects.complete();
      }

      delete (localState as NgtAnyRecord)['objects'];
      delete (localState as NgtAnyRecord)['addObject'];
      delete (localState as NgtAnyRecord)['removeObject'];
      delete (localState as NgtAnyRecord)['nonObjects'];
      delete (localState as NgtAnyRecord)['addNonObject'];
      delete (localState as NgtAnyRecord)['removeNonObject'];

      delete (localState as NgtAnyRecord)['store'];
      delete (localState as NgtAnyRecord)['handlers'];
      delete (localState as NgtAnyRecord)['memoized'];

      if (!localState.primitive) {
        delete (three as NgtAnyRecord)['__ngt__'];
      }
    }
  }

  traverseAndRemoveChildNodes(childNodes: NodeList, parentThree?: NgtInstanceNode) {
    let i = childNodes.length - 1;
    while (i >= 0) {
      const node = childNodes.item(i)!;
      const three = this.getThree(node as HTMLElement);
      if (three) {
        if (parentThree) removeThreeChild(parentThree, three, true);
        this.removeThreeState(three);
      }

      const nodes = node.childNodes;
      if (nodes.length) {
        this.traverseAndRemoveChildNodes(nodes);
      }
      this.removeDomState(node as HTMLElement | Comment);
      i--;
    }
  }

  tryAssignPortalContainer(portal: HTMLElement) {
    const portalState = this.getPortal(portal);
    if (portalState) {
      const portalStore = portalState.injectorFactory().get(NgtStore, null);
      if (portalStore) {
        const portalContainer = portalStore.get('scene');
        if (portalContainer) {
          this.addDomThree(portal, portalContainer);
        }
      }
    }
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
    console.log(commentState)
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
}
