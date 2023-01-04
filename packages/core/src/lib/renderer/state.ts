import { ChangeDetectorRef, getDebugNode, Injector, Type } from '@angular/core';
import { NgtArgs } from '../directives/args';
import { NgtAttachArray } from '../directives/attach-array';
import { NgtAttachFn } from '../directives/attach-fn';
import { NgtRef } from '../directives/ref';
import { NgtStore } from '../stores/store';
import {
  NgtAnyRecord,
  NgtHasValidateForRenderer,
  NgtInstanceLocalState,
  NgtInstanceNode,
} from '../types';
import { applyProps } from '../utils/apply-props';
import { getLocalState } from '../utils/instance';
import { ATTRIBUTES, removeThreeChild } from './utils';

export interface NgtRendererRootState {
  store: NgtStore;
  cdr: ChangeDetectorRef;
  compoundPrefixes: string[];
}

export interface NgtRendererCommonNode {
  renderRemoved: boolean;
  renderParent: NgtRendererNode | null;
  renderChildren: NgtRendererNode[];
}

export interface NgtRendererInstanceNode extends NgtInstanceNode, NgtRendererCommonNode {
  renderType: 'instance';
  compound?: { applyFirst: boolean; props: Record<string, any> };
  localState: () => NgtInstanceLocalState;
  compoundParent?: NgtRendererCompoundNode;
  rawValue?: any;
}

export interface NgtRendererCompoundNode extends NgtRendererCommonNode {
  renderType: 'compound';
  compounded?: NgtRendererInstanceNode;
  localState: () => NgtInstanceLocalState;
  queueOps: Set<() => void>;
  cleanUps: Set<() => void>;
  renderAttributes: Record<string, any>;
  renderProperties: Record<string, any>;
}

export interface NgtRendererCommentNode extends NgtRendererCommonNode, Comment {
  renderType: 'comment';
  injectorFactory: () => Injector;
}

export interface NgtRendererPortalNode extends NgtRendererCommonNode {
  renderType: 'portal';
  injectorFactory: () => Injector;
  portalContainer?: NgtRendererInstanceNode;
}

export interface NgtRendererComponentNode extends NgtRendererCommonNode {
  renderType: 'component';
}

export type NgtRendererNode =
  | NgtRendererInstanceNode
  | NgtRendererCompoundNode
  | NgtRendererCommentNode
  | NgtRendererPortalNode
  | NgtRendererComponentNode;

export class NgtRendererState {
  private readonly commentNodes = new Set<NgtRendererCommentNode>();
  private readonly portalNodes = new Set<NgtRendererPortalNode>();

  constructor(private readonly root: NgtRendererRootState) {}

  createNode(renderType: NgtRendererNode['renderType'], node: NgtAnyRecord) {
    const rendererNode = Object.assign(node, {
      renderRemoved: false,
      renderType,
      renderParent: null,
      renderChildren: [],
    } as NgtRendererNode);

    if (rendererNode.renderType === 'instance') {
      rendererNode.localState = () => getLocalState(node)!;
      return rendererNode;
    }

    if (rendererNode.renderType === 'comment' || rendererNode.renderType === 'portal') {
      rendererNode.injectorFactory = () => getDebugNode(node)!.injector;
      if (rendererNode.renderType === 'comment') {
        this.commentNodes.add(rendererNode);
      } else {
        this.portalNodes.add(rendererNode);
      }
      return rendererNode;
    }

    if (rendererNode.renderType === 'compound') {
      rendererNode.queueOps = new Set();
      rendererNode.cleanUps = new Set();
      rendererNode.renderAttributes = {};
      rendererNode.renderProperties = {};
      return rendererNode;
    }

    return rendererNode;
  }

  setParent(node: NgtRendererNode, parent: NgtRendererNode) {
    if (!node.renderParent) {
      node.renderParent = parent;
    }
  }

  addChild(node: NgtRendererNode, child: NgtRendererNode) {
    if (!node.renderChildren.includes(child)) {
      node.renderChildren.push(child);
    }
  }

  removeChild(node: NgtRendererNode, child: NgtRendererNode) {
    const index = node.renderChildren.findIndex((c) => child === c);
    if (index >= 0) {
      node.renderChildren.splice(index, 1);
    }
  }

  setCompoundInstance(compound: NgtRendererCompoundNode, instance: NgtRendererInstanceNode) {
    compound.compounded = instance;
    compound.localState = () => getLocalState(instance);
    if (Object.keys(compound.renderAttributes).length) {
      for (const [key, value] of Object.entries(compound.renderAttributes)) {
        this.applyAttribute(instance, key, value);
      }
    }

    if (Object.keys(compound.renderProperties).length) {
      for (const [key, value] of Object.entries(compound.renderProperties)) {
        this.applyProperty(instance, key, value);
      }
    }
    this.executeQueuedOperation(compound);
  }

  queueCompoundOperation(node: NgtRendererCompoundNode, op: () => void) {
    node.queueOps.add(op);
  }

  executeQueuedOperation(node: NgtRendererCompoundNode) {
    if (node.queueOps.size) {
      queueMicrotask(() => {
        node.queueOps.forEach((op) => op());
        node.queueOps.clear();
      });
    }
  }

  processPortal(portal: NgtRendererPortalNode) {
    const injector = portal.injectorFactory?.();
    if (injector) {
      const portalStore = injector.get(NgtStore, null);
      if (portalStore) {
        const portalContainer = portalStore.get('scene');
        if (portalContainer) {
          portal.portalContainer = this.createNode(
            'instance',
            portalContainer
          ) as NgtRendererInstanceNode;
        }
      }
    }
  }

  applyAttribute(el: NgtRendererInstanceNode, name: string, value: string) {
    if (name === ATTRIBUTES.RENDER_PRIORITY) {
      // priority needs to be set as an attribute string so that they can be set as early as possible
      // we convert that string to a number here. If it is invalid, we default to 0
      let priority = Number(value);
      if (isNaN(priority)) {
        priority = 0;
        console.warn(`[NGT] passed in "priority" is an invalid number. Default to 0`);
      }

      el.localState().priority = priority;
      return;
    }

    if (name === ATTRIBUTES.COMPOUND) {
      // we set the compound property on NgtRendererInstanceNode now so we know that this instance is being compounded
      el.compound = { applyFirst: value === '' || value === 'first', props: {} };
      return;
    }

    if (name === ATTRIBUTES.ATTACH) {
      // handle attach attribute as string
      // attach can accept a dotted paths
      const paths = value.split('.');
      if (paths.length) el.localState().attach = paths;
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
  }

  applyProperty(el: NgtRendererInstanceNode, name: string, value: any) {
    if (el.renderRemoved) return;
    if (el.compound?.props && name in el.compound.props && !el.compound.applyFirst) {
      value = el.compound.props[name];
    }
    applyProps(el, { [name]: value });
  }

  isCompound(name: string) {
    return this.root.compoundPrefixes.some((prefix) => name.startsWith(prefix));
  }

  get rootScene() {
    return this.root.store.get('scene');
  }

  get rootCdr() {
    return this.root.cdr;
  }

  getClosestParentWithInstance(node: NgtRendererNode): NgtRendererInstanceNode | null {
    let parent = node.renderParent;
    while (parent && parent.renderType !== 'instance') {
      parent = parent.renderParent;
    }

    return parent as NgtRendererInstanceNode;
  }

  getClosestParentWithCompound(node: NgtRendererInstanceNode) {
    if (node.compoundParent) return node.compoundParent;
    let parent: NgtRendererNode | null = node.renderParent;
    if (parent && parent.renderType === 'compound' && !parent.compounded) {
      return parent;
    }
    while (
      parent &&
      ((parent.renderType === 'instance' && !parent.compoundParent) ||
        parent.renderType !== 'compound')
    ) {
      parent = parent.renderParent;
    }

    if (!parent) return;

    if (
      (parent as NgtRendererNode).renderType === 'instance' &&
      (parent as unknown as NgtRendererInstanceNode).compoundParent
    ) {
      return (parent as unknown as NgtRendererInstanceNode).compoundParent;
    }

    if (parent.renderType === 'compound' && !parent.compounded) {
      return parent;
    }

    return null;
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

  remove(node: NgtRendererNode, parent?: NgtRendererInstanceNode) {
    if (node.renderRemoved) return;
    if (node.renderType === 'instance') {
      delete node.compound;
      delete node.compoundParent;

      const localState = node.localState?.();
      if (localState) {
        if (localState.objects) {
          const objects = localState.objects.value;
          objects.forEach((obj) => this.remove(obj));
          localState.objects.complete();
        }

        if (localState.nonObjects) {
          const nonObjects = localState.nonObjects.value;
          nonObjects.forEach((obj) => this.remove(obj));
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
          delete (node as NgtAnyRecord)['__ngt__'];
        }
      }

      node.localState = null as unknown as NgtRendererInstanceNode['localState'];
    }

    if (node.renderType === 'comment') {
      node.injectorFactory = null as unknown as NgtRendererCommentNode['injectorFactory'];
    }

    if (node.renderType === 'portal') {
      node.injectorFactory = null as unknown as NgtRendererPortalNode['injectorFactory'];
    }

    if (node.renderType === 'compound') {
      node.localState = null as unknown as NgtRendererCompoundNode['localState'];
      delete node.compounded;
      node.renderAttributes = null as unknown as NgtRendererCompoundNode['renderAttributes'];
      node.renderProperties = null as unknown as NgtRendererCompoundNode['renderProperties'];
      node.queueOps.clear();
      node.queueOps = null as unknown as NgtRendererCompoundNode['queueOps'];
      node.cleanUps.forEach((cleanUp) => cleanUp());
      node.cleanUps.clear();
      node.cleanUps = null as unknown as NgtRendererCompoundNode['cleanUps'];
    }

    node.renderParent = null;
    for (const renderChild of node.renderChildren || []) {
      if (renderChild.renderType === 'instance' && parent) {
        removeThreeChild(parent, renderChild, true);
      }
      this.remove(renderChild, parent);
    }
    node.renderChildren = null as unknown as NgtRendererNode['renderChildren'];
    node.renderRemoved = true;
  }

  #firstNonInjectedDirective<T extends NgtHasValidateForRenderer>(dir: Type<T>) {
    let directive: T | undefined;

    // we only care about the comment states
    const commentNodes = Array.from(this.commentNodes.values());

    let i = commentNodes.length - 1;
    while (i >= 0) {
      // loop through the nodes backwards
      const injector = getDebugNode(commentNodes[i])?.injector;
      if (!injector) {
        i--;
        continue;
      }
      const instance = injector.get(dir, null);
      if (instance && instance.validate()) {
        directive = instance;
        // TODO: testing this to see if we can stop tracking this comment node
        // this.commentNodes.delete(commentNodes[i]);
        break;
      }

      i--;
    }

    return directive;
  }

  #tryGetPortalStore() {
    let store: NgtStore | undefined;
    // we only care about the portal states because NgtStore only differs per Portal
    const portalState = Array.from(this.portalNodes.values());
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
