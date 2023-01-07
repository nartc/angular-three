import { ChangeDetectorRef, getDebugNode, Injector, Type } from '@angular/core';
import { NgtArgs } from '../directives/args';
import { NgtAttachArray } from '../directives/attach-array';
import { NgtAttachFn } from '../directives/attach-fn';
import { NgtRef } from '../directives/ref';
import { NgtStore } from '../stores/store';
import { NgtAnyRecord, NgtHasValidateForRenderer, NgtInstanceLocalState } from '../types';
import { applyProps } from '../utils/apply-props';
import { getLocalState } from '../utils/instance';
import { ATTRIBUTES, removeThreeChild } from './utils';

export interface NgtRendererRootState {
  store: NgtStore;
  cdr: ChangeDetectorRef;
  compoundPrefixes: string[];
}

export type NgtRendererCommonNode = {
  __ngt_renderer__: {
    removed: boolean;
    parent: NgtRendererNode | null;
    children: NgtRendererNode[];
  };
};

export type NgtRendererInstanceNode = {
  __ngt_renderer_type__: 'instance';
  __ngt_renderer__: {
    compound?: { applyFirst: boolean; props: Record<string, any> };
    localState: () => NgtInstanceLocalState;
    compoundParent?: NgtRendererCompoundNode;
    rawValue?: any;
  };
} & NgtRendererCommonNode;

export type NgtRendererCompoundNode = {
  __ngt_renderer_type__: 'compound';
  __ngt_renderer__: {
    compounded?: NgtRendererInstanceNode;
    localState: () => NgtInstanceLocalState;
    queueOps: Set<() => void>;
    cleanUps: Set<() => void>;
    attributes: Record<string, any>;
    properties: Record<string, any>;
  };
} & NgtRendererCommonNode;

export type NgtRendererCommentNode = {
  __ngt_renderer_type__: 'comment';
  __ngt_renderer__: {
    injectorFactory: () => Injector;
  };
} & Comment &
  NgtRendererCommonNode;

export type NgtRendererPortalNode = {
  __ngt_renderer_type__: 'portal';
  __ngt_renderer__: {
    injectorFactory: () => Injector;
    container?: NgtRendererInstanceNode;
  };
} & NgtRendererCommonNode;

export type NgtRendererComponentNode = {
  __ngt_renderer_type__: 'component';
} & NgtRendererCommonNode;

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

  createNode(type: NgtRendererNode['__ngt_renderer_type__'], node: NgtAnyRecord) {
    const rendererNode = Object.assign(node, {
      __ngt_renderer_type__: type,
      __ngt_renderer__: {
        ...(node['__ngt_renderer__'] || {}),
        removed: false,
        parent: null,
        children: [],
      },
    }) as NgtRendererNode;

    if (rendererNode.__ngt_renderer_type__ === 'instance') {
      rendererNode.__ngt_renderer__.localState = () => getLocalState(node)!;
      return rendererNode;
    }

    if (
      rendererNode.__ngt_renderer_type__ === 'comment' ||
      rendererNode.__ngt_renderer_type__ === 'portal'
    ) {
      rendererNode.__ngt_renderer__.injectorFactory = () => getDebugNode(node)!.injector;
      if (rendererNode.__ngt_renderer_type__ === 'comment') {
        this.commentNodes.add(rendererNode);
      } else {
        this.portalNodes.add(rendererNode);
      }
      return rendererNode;
    }

    if (rendererNode.__ngt_renderer_type__ === 'compound') {
      rendererNode.__ngt_renderer__.queueOps = new Set();
      rendererNode.__ngt_renderer__.cleanUps = new Set();
      rendererNode.__ngt_renderer__.attributes = {};
      rendererNode.__ngt_renderer__.properties = {};
      return rendererNode;
    }

    return rendererNode;
  }

  setParent(node: NgtRendererNode, parent: NgtRendererNode) {
    if (!node.__ngt_renderer__.parent) {
      node.__ngt_renderer__.parent = parent;
    }
  }

  addChild(node: NgtRendererNode, child: NgtRendererNode) {
    if (!node.__ngt_renderer__.children.includes(child)) {
      node.__ngt_renderer__.children.push(child);
    }
  }

  removeChild(node: NgtRendererNode, child: NgtRendererNode) {
    const index = node.__ngt_renderer__.children.findIndex((c: NgtRendererNode) => child === c);
    if (index >= 0) {
      node.__ngt_renderer__.children.splice(index, 1);
    }
  }

  setCompoundInstance(compound: NgtRendererCompoundNode, instance: NgtRendererInstanceNode) {
    compound.__ngt_renderer__.compounded = instance;
    compound.__ngt_renderer__.localState = () => getLocalState(instance);
    if (Object.keys(compound.__ngt_renderer__.attributes).length) {
      for (const [key, value] of Object.entries(compound.__ngt_renderer__.attributes)) {
        this.applyAttribute(instance, key, value);
      }
    }

    if (Object.keys(compound.__ngt_renderer__.properties).length) {
      for (const [key, value] of Object.entries(compound.__ngt_renderer__.properties)) {
        this.applyProperty(instance, key, value);
      }
    }
    this.executeQueuedOperation(compound);
  }

  queueCompoundOperation(node: NgtRendererCompoundNode, op: () => void) {
    node.__ngt_renderer__.queueOps.add(op);
  }

  executeQueuedOperation(node: NgtRendererCompoundNode) {
    if (node.__ngt_renderer__.queueOps.size) {
      queueMicrotask(() => {
        node.__ngt_renderer__.queueOps.forEach((op) => op());
        node.__ngt_renderer__.queueOps.clear();
      });
    }
  }

  processPortal(portal: NgtRendererPortalNode) {
    const injector = portal.__ngt_renderer__.injectorFactory?.();
    if (injector) {
      const portalStore = injector.get(NgtStore, null);
      if (portalStore) {
        const portalContainer = portalStore.get('scene');
        if (portalContainer) {
          portal.__ngt_renderer__.container = this.createNode(
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

      el.__ngt_renderer__.localState().priority = priority;
      return;
    }

    if (name === ATTRIBUTES.COMPOUND) {
      // we set the compound property on NgtRendererInstanceNode now so we know that this instance is being compounded
      el.__ngt_renderer__.compound = { applyFirst: value === '' || value === 'first', props: {} };
      return;
    }

    if (name === ATTRIBUTES.ATTACH) {
      // handle attach attribute as string
      // attach can accept a dotted paths
      const paths = value.split('.');
      if (paths.length) el.__ngt_renderer__.localState().attach = paths;
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
    if (el.__ngt_renderer__.removed) return;
    if (
      el.__ngt_renderer__.compound?.props &&
      name in el.__ngt_renderer__.compound.props &&
      !el.__ngt_renderer__.compound.applyFirst
    ) {
      value = el.__ngt_renderer__.compound.props[name];
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
    let parent = node.__ngt_renderer__.parent;
    while (parent && parent.__ngt_renderer_type__ !== 'instance') {
      parent =
        parent.__ngt_renderer_type__ === 'portal' && parent.__ngt_renderer__.container
          ? parent.__ngt_renderer__.container
          : parent.__ngt_renderer__.parent;
    }

    return parent as NgtRendererInstanceNode;
  }

  getClosestParentWithCompound(node: NgtRendererInstanceNode) {
    if (node.__ngt_renderer__.compoundParent) return node.__ngt_renderer__.compoundParent;
    let parent: NgtRendererNode | null = node.__ngt_renderer__.parent;
    if (
      parent &&
      parent.__ngt_renderer_type__ === 'compound' &&
      !parent.__ngt_renderer__.compounded
    ) {
      return parent;
    }
    while (
      parent &&
      ((parent.__ngt_renderer_type__ === 'instance' && !parent.__ngt_renderer__.compoundParent) ||
        parent.__ngt_renderer_type__ !== 'compound')
    ) {
      parent = parent.__ngt_renderer__.parent;
    }

    if (!parent) return;

    if (
      (parent as NgtRendererNode).__ngt_renderer_type__ === 'instance' &&
      (parent as unknown as NgtRendererInstanceNode).__ngt_renderer__.compoundParent
    ) {
      return (parent as unknown as NgtRendererInstanceNode).__ngt_renderer__.compoundParent;
    }

    if (parent.__ngt_renderer_type__ === 'compound' && !parent.__ngt_renderer__.compounded) {
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
    if (node.__ngt_renderer__.removed) return;
    if (node.__ngt_renderer_type__ === 'instance') {
      delete node.__ngt_renderer__.compound;
      delete node.__ngt_renderer__.compoundParent;

      const localState = node.__ngt_renderer__.localState?.();
      if (localState) {
        if (localState.objects) {
          const objects = localState.objects.value;
          objects.forEach((obj: NgtRendererInstanceNode) => this.remove(obj));
          localState.objects.complete();
        }

        if (localState.nonObjects) {
          const nonObjects = localState.nonObjects.value;
          nonObjects.forEach((obj: NgtRendererInstanceNode) => this.remove(obj));
          localState.nonObjects.complete();
        }

        if (localState.afterUpdate) {
          localState.afterUpdate.complete();
        }

        delete (localState as NgtAnyRecord)['objects'];
        delete (localState as NgtAnyRecord)['addObject'];
        delete (localState as NgtAnyRecord)['removeObject'];
        delete (localState as NgtAnyRecord)['nonObjects'];
        delete (localState as NgtAnyRecord)['addNonObject'];
        delete (localState as NgtAnyRecord)['removeNonObject'];
        delete (localState as NgtAnyRecord)['afterUpdate'];

        delete (localState as NgtAnyRecord)['store'];
        delete (localState as NgtAnyRecord)['handlers'];
        delete (localState as NgtAnyRecord)['memoized'];

        if (!localState.primitive) {
          delete (node as NgtAnyRecord)['__ngt__'];
        }
      }

      node.__ngt_renderer__.localState =
        null as unknown as NgtRendererInstanceNode['__ngt_renderer__']['localState'];
    }

    if (node.__ngt_renderer_type__ === 'comment') {
      node.__ngt_renderer__.injectorFactory =
        null as unknown as NgtRendererCommentNode['__ngt_renderer__']['injectorFactory'];
    }

    if (node.__ngt_renderer_type__ === 'portal') {
      node.__ngt_renderer__.injectorFactory =
        null as unknown as NgtRendererPortalNode['__ngt_renderer__']['injectorFactory'];
    }

    if (node.__ngt_renderer_type__ === 'compound') {
      node.__ngt_renderer__.localState =
        null as unknown as NgtRendererCompoundNode['__ngt_renderer__']['localState'];
      delete node.__ngt_renderer__.compounded;
      node.__ngt_renderer__.attributes =
        null as unknown as NgtRendererCompoundNode['__ngt_renderer__']['attributes'];
      node.__ngt_renderer__.properties =
        null as unknown as NgtRendererCompoundNode['__ngt_renderer__']['properties'];
      node.__ngt_renderer__.queueOps.clear();
      node.__ngt_renderer__.queueOps =
        null as unknown as NgtRendererCompoundNode['__ngt_renderer__']['queueOps'];
      node.__ngt_renderer__.cleanUps.forEach((cleanUp: () => void) => cleanUp());
      node.__ngt_renderer__.cleanUps.clear();
      node.__ngt_renderer__.cleanUps =
        null as unknown as NgtRendererCompoundNode['__ngt_renderer__']['cleanUps'];
    }

    node.__ngt_renderer__.parent = null;
    for (const renderChild of node.__ngt_renderer__.children || []) {
      if (renderChild.__ngt_renderer_type__ === 'instance' && parent) {
        removeThreeChild(parent, renderChild, true);
      }
      this.remove(renderChild, parent);
    }
    node.__ngt_renderer__.children =
      null as unknown as NgtRendererNode['__ngt_renderer__']['children'];
    node.__ngt_renderer__.removed = true;
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
      const injector = portalState[i].__ngt_renderer__.injectorFactory?.();
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
