import { ChangeDetectorRef, getDebugNode, Injector, Type } from '@angular/core';
import { NgtArgs } from '../directives/args';
import { NgtAttachArray } from '../directives/attach-array';
import { NgtAttachFn } from '../directives/attach-fn';
import { NgtRef } from '../directives/ref';
import { NgtStore } from '../stores/store';
import { NgtHasValidateForRenderer, NgtInstanceLocalState, NgtInstanceNode } from '../types';
import { getLocalState } from '../utils/instance';

export interface NgtRendererRootState {
  store: NgtStore;
  cdr: ChangeDetectorRef;
  compoundPrefixes: string[];
}

export class NgtRendererNode {
  type: 'compound' | 'comment' | 'portal' | 'three' | 'component';
  element?: Node;
  secondaryElement?: Node;
  injectorFactory?: () => Injector;

  instance?: NgtInstanceNode;
  localStateFactory?: () => NgtInstanceLocalState;

  parent: NgtRendererNode | null = null;
  children: NgtRendererNode[] = [];

  constructor(
    type: 'compound' | 'comment' | 'portal' | 'three' | 'component',
    elementOrInstance: Node | NgtInstanceNode,
    element?: Node
  ) {
    this.type = type;
    if (elementOrInstance instanceof Node) {
      this.element = elementOrInstance;
      this.injectorFactory = () => getDebugNode(this.element)!.injector;
    } else {
      this.instance = elementOrInstance;
      this.localStateFactory = () => getLocalState(this.instance);
    }

    if (element) {
      this.secondaryElement = element;
    }
  }

  setParent(parent: NgtRendererNode) {
    if (!this.parent) {
      this.parent = parent;
    }
  }

  addChild(node: NgtRendererNode) {
    if (this.children.includes(node)) return;
    this.children.push(node);
  }

  removeChild(node: NgtRendererNode) {
    const index = this.children.findIndex((child) => child === node);
    if (index >= 0) {
      this.children.splice(index, 1);
    }
  }

  get threeChildren() {
    return this.children.filter((child) => child.type === 'three');
  }

  get injector() {
    return this.injectorFactory?.();
  }

  get localState() {
    return this.localStateFactory?.();
  }

  destroy() {
    this.children = null as unknown as NgtRendererNode[];
    this.parent = null;
    this.element = null as unknown as Node;
    this.instance = null as unknown as NgtInstanceNode;
  }
}

export class NgtRendererState {
  readonly nodes = new Set<NgtRendererNode>();

  constructor(private readonly root: NgtRendererRootState) {}

  addNode(node: NgtRendererNode) {
    if (node.injectorFactory) {
      this.nodes.add(node);
    }
  }

  isCompound(name: string) {
    return this.root.compoundPrefixes.some((prefix) => name.startsWith(prefix));
  }

  get rootScene() {
    return this.root.store.get('scene');
  }

  getCreationState() {
    const ngtArgs = this.#firstNonInjectedDirective(NgtArgs);
    const ngtAttachFn = this.#firstNonInjectedDirective(NgtAttachFn);
    const ngtAttachArray = this.#firstNonInjectedDirective(NgtAttachArray);
    const ngtRef = this.#firstNonInjectedDirective(NgtRef);

    const injectedArgs = ngtArgs?.args || [];
    const injectedRef = ngtRef?.ref;

    const injectedAttachFn = ngtAttachFn?.attachFn;
    const injectedAttachArray = ngtAttachArray?.attachArray;

    const attach = injectedAttachFn || injectedAttachArray || undefined;
    const store = this.#tryGetPortalStore();

    return { injectedArgs, injectedRef, attach, store };
  }

  #firstNonInjectedDirective<T extends NgtHasValidateForRenderer>(dir: Type<T>) {
    let directive: T | undefined;

    // we only care about the comment states
    const commentNodes = Array.from(this.nodes.values()).filter((node) => node.type === 'comment');
    console.log(commentNodes);

    let i = commentNodes.length - 1;
    while (i >= 0) {
      // loop through the nodes backwards
      const injector = commentNodes[i].injector;
      if (!injector) {
        i--;
        continue;
      }
      const instance = injector.get(dir, null);
      if (instance && instance.validate()) {
        directive = instance;
        // TODO: testing this to see if we can stop tracking this comment node
        this.nodes.delete(commentNodes[i]);
        break;
      }

      i--;
    }

    return directive;
  }

  #tryGetPortalStore() {
    let store: NgtStore | undefined;
    // we only care about the portal states because NgtStore only differs per Portal
    const portalState = Array.from(this.nodes.values()).filter((node) => node.type === 'portal');
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
