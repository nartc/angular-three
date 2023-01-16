import { ChangeDetectorRef, getDebugNode, Injector, Type } from '@angular/core';
import { NgtInjectedRef } from '../di/ref';
import { NgtArgs } from '../directives/args';
import { NgtHasValidateForRenderer } from '../directives/has-validate-for-renderer';
import { NgtStore } from '../stores/store';
import { NgtAnyRecord, NgtInstanceLocalState } from '../types';
import { applyProps } from '../utils/apply-props';
import { getLocalState } from '../utils/instance';
import { is } from '../utils/is';
import { NgtRendererClassId, NgtRendererCompoundClassId } from './class-id';
import { removeThreeChild, SPECIAL_PROPERTIES } from './utils';

export interface NgtRendererRootState {
  store: NgtStore;
  cdr: ChangeDetectorRef;
  compoundPrefixes: string[];
}

export type NgtRenderer = [
  type: 'instance' | 'compound' | 'comment' | 'portal' | 'component',
  parent: NgtRendererNode | null,
  children: NgtRendererNode[],
  removed: boolean,
  comments: NgtRendererNode[],
  compound: [applyFirst: boolean, props: Record<string, any>],
  localState: () => NgtInstanceLocalState,
  compoundParent: NgtRendererNode,
  rawValue: any,
  ref: NgtInjectedRef<any>,
  injectorFactory: () => Injector,
  container: NgtRendererNode,
  compounded: NgtRendererNode,
  queueOps: Set<() => void>,
  cleanUps: Set<() => void>,
  attributes: Record<string, any>,
  properties: Record<string, any>
];

export type NgtRendererNode = {
  __ngt_renderer__: NgtRenderer;
};

export class NgtRendererState {
  private readonly comments: NgtRendererNode[] = [];
  private readonly portals: NgtRendererNode[] = [];

  constructor(private readonly root: NgtRendererRootState) {}

  createNode(type: NgtRenderer[0], node: NgtAnyRecord) {
    const rendererNode = Object.assign(node, {
      __ngt_renderer__: [
        type,
        null,
        [],
        false,
        [],
        undefined!,
        undefined!,
        undefined!,
        undefined!,
        undefined!,
        undefined!,
        undefined!,
        undefined!,
        undefined!,
        undefined!,
        undefined!,
        undefined!,
      ] as NgtRenderer,
    });

    if (rendererNode.__ngt_renderer__)
      if (rendererNode.__ngt_renderer__[NgtRendererClassId.type] === 'instance') {
        rendererNode.__ngt_renderer__[NgtRendererClassId.localState] = () => getLocalState(node)!;
        return rendererNode;
      }

    if (
      rendererNode.__ngt_renderer__[NgtRendererClassId.type] === 'comment' ||
      rendererNode.__ngt_renderer__[NgtRendererClassId.type] === 'portal'
    ) {
      rendererNode.__ngt_renderer__[NgtRendererClassId.injectorFactory] = () =>
        getDebugNode(node)!.injector;
      if (rendererNode.__ngt_renderer__[NgtRendererClassId.type] === 'comment') {
        // we attach an arrow function to the Comment node
        // In our directives, we can call this function to only track the RendererNode
        rendererNode['__ngt_add_comment__'] = () => {
          this.comments.push(rendererNode);
        };
      } else {
        this.portals.push(rendererNode);
      }
      return rendererNode;
    }

    if (rendererNode.__ngt_renderer__[NgtRendererClassId.type] === 'compound') {
      rendererNode.__ngt_renderer__[NgtRendererClassId.queueOps] = new Set();
      rendererNode.__ngt_renderer__[NgtRendererClassId.cleanUps] = new Set();
      rendererNode.__ngt_renderer__[NgtRendererClassId.attributes] = {};
      rendererNode.__ngt_renderer__[NgtRendererClassId.properties] = {};
      return rendererNode;
    }

    return rendererNode;
  }

  setParent(node: NgtRendererNode, parent: NgtRendererNode) {
    if (!node.__ngt_renderer__[NgtRendererClassId.parent]) {
      node.__ngt_renderer__[NgtRendererClassId.parent] = parent;
    }
  }

  addChild(node: NgtRendererNode, child: NgtRendererNode) {
    if (!node.__ngt_renderer__[NgtRendererClassId.children].includes(child)) {
      node.__ngt_renderer__[NgtRendererClassId.children].push(child);
    }
  }

  removeChild(node: NgtRendererNode, child: NgtRendererNode) {
    const index = node.__ngt_renderer__[NgtRendererClassId.children].findIndex((c) => child === c);
    if (index >= 0) {
      node.__ngt_renderer__[NgtRendererClassId.children].splice(index, 1);
    }
  }

  setCompoundInstance(compound: NgtRendererNode, instance: NgtRendererNode) {
    compound.__ngt_renderer__[NgtRendererClassId.compounded] = instance;
    compound.__ngt_renderer__[NgtRendererClassId.localState] = () => getLocalState(instance);
    if (Object.keys(compound.__ngt_renderer__[NgtRendererClassId.attributes]).length) {
      for (const [key, value] of Object.entries(
        compound.__ngt_renderer__[NgtRendererClassId.attributes]
      )) {
        this.applyAttribute(instance, key, value);
      }
    }

    if (Object.keys(compound.__ngt_renderer__[NgtRendererClassId.properties]).length) {
      for (const [key, value] of Object.entries(
        compound.__ngt_renderer__[NgtRendererClassId.properties]
      )) {
        this.applyProperty(instance, key, value);
      }
    }
    this.executeQueuedOperation(compound);
  }

  queueCompoundOperation(node: NgtRendererNode, op: () => void) {
    node.__ngt_renderer__[NgtRendererClassId.queueOps].add(op);
  }

  executeQueuedOperation(node: NgtRendererNode) {
    if (node.__ngt_renderer__[NgtRendererClassId.queueOps].size) {
      queueMicrotask(() => {
        node.__ngt_renderer__[NgtRendererClassId.queueOps].forEach((op) => op());
        node.__ngt_renderer__[NgtRendererClassId.queueOps].clear();
      });
    }
  }

  processPortal(portal: NgtRendererNode) {
    const injector = portal.__ngt_renderer__[NgtRendererClassId.injectorFactory]?.();
    if (injector) {
      const portalStore = injector.get(NgtStore, null);
      if (portalStore) {
        const portalContainer = portalStore.get('scene');
        if (portalContainer) {
          portal.__ngt_renderer__[NgtRendererClassId.container] = this.createNode(
            'instance',
            portalContainer
          );
        }
      }
    }
  }

  applyAttribute(el: NgtRendererNode, name: string, value: string) {
    if (name === SPECIAL_PROPERTIES.RENDER_PRIORITY) {
      // priority needs to be set as an attribute string so that they can be set as early as possible
      // we convert that string to a number here. If it is invalid, we default to 0
      let priority = Number(value);
      if (isNaN(priority)) {
        priority = 0;
        console.warn(`[NGT] passed in "priority" is an invalid number. Default to 0`);
      }

      el.__ngt_renderer__[NgtRendererClassId.localState]().priority = priority;
      return;
    }

    if (name === SPECIAL_PROPERTIES.COMPOUND) {
      // we set the compound property on NgtRendererInstanceNode now so we know that this instance is being compounded
      el.__ngt_renderer__[NgtRendererClassId.compound] = [value === '' || value === 'first', {}];
      return;
    }

    if (name === SPECIAL_PROPERTIES.ATTACH) {
      // handle attach attribute as string
      // attach can accept a dotted paths
      const paths = value.split('.');
      if (paths.length) el.__ngt_renderer__[NgtRendererClassId.localState]().attach = paths;
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

  applyProperty(el: NgtRendererNode, name: string, value: any) {
    if (el.__ngt_renderer__[NgtRendererClassId.removed]) return;
    if (name === SPECIAL_PROPERTIES.REF && is.ref(value)) {
      el.__ngt_renderer__[NgtRendererClassId.ref] = value as NgtInjectedRef<any>;
      value.nativeElement = el;
      return;
    }
    if (
      el.__ngt_renderer__[NgtRendererClassId.compound]?.[NgtRendererCompoundClassId.props] &&
      name in el.__ngt_renderer__[NgtRendererClassId.compound][NgtRendererCompoundClassId.props] &&
      !el.__ngt_renderer__[NgtRendererClassId.compound][NgtRendererCompoundClassId.applyFirst]
    ) {
      value =
        el.__ngt_renderer__[NgtRendererClassId.compound][NgtRendererCompoundClassId.props][name];
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

  getClosestParentWithInstance(node: NgtRendererNode): NgtRendererNode | null {
    let parent = node.__ngt_renderer__[NgtRendererClassId.parent];
    while (parent && parent.__ngt_renderer__[NgtRendererClassId.type] !== 'instance') {
      parent = parent.__ngt_renderer__[NgtRendererClassId.container]
        ? parent.__ngt_renderer__[NgtRendererClassId.container]
        : parent.__ngt_renderer__[NgtRendererClassId.parent];
    }

    return parent;
  }

  getClosestParentWithCompound(node: NgtRendererNode) {
    if (node.__ngt_renderer__[NgtRendererClassId.compoundParent])
      return node.__ngt_renderer__[NgtRendererClassId.compoundParent];

    let parent: NgtRendererNode | null = node.__ngt_renderer__[NgtRendererClassId.parent];
    if (
      parent &&
      parent.__ngt_renderer__[NgtRendererClassId.type] === 'compound' &&
      !parent.__ngt_renderer__[NgtRendererClassId.compounded]
    ) {
      return parent;
    }
    while (
      parent &&
      ((parent.__ngt_renderer__[NgtRendererClassId.type] === 'instance' &&
        !parent.__ngt_renderer__[NgtRendererClassId.compoundParent]) ||
        parent.__ngt_renderer__[NgtRendererClassId.type] !== 'compound')
    ) {
      parent = parent.__ngt_renderer__[NgtRendererClassId.parent];
    }

    if (!parent) return;

    if (
      parent.__ngt_renderer__[NgtRendererClassId.type] === 'instance' &&
      parent.__ngt_renderer__[NgtRendererClassId.compoundParent]
    ) {
      return parent.__ngt_renderer__[NgtRendererClassId.compoundParent];
    }

    if (!parent.__ngt_renderer__[NgtRendererClassId.compounded]) {
      return parent;
    }

    return null;
  }

  getCreationState() {
    const injectedArgs = this.#firstNonInjectedDirective(NgtArgs)?.args || [];
    const store = this.#tryGetPortalStore();
    return { injectedArgs, store };
  }

  remove(node: NgtRendererNode, parent?: NgtRendererNode) {
    if (node.__ngt_renderer__[NgtRendererClassId.removed]) return;
    if (node.__ngt_renderer__[NgtRendererClassId.type] === 'instance') {
      node.__ngt_renderer__[NgtRendererClassId.compound] = undefined!;
      node.__ngt_renderer__[NgtRendererClassId.compoundParent] = undefined!;

      const localState = node.__ngt_renderer__[NgtRendererClassId.localState]?.();
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

      node.__ngt_renderer__[NgtRendererClassId.localState] = null!;
    }

    if (node.__ngt_renderer__[NgtRendererClassId.type] === 'comment') {
      node.__ngt_renderer__[NgtRendererClassId.injectorFactory] = null!;
      delete (node as NgtAnyRecord)['__ngt_add_comment__'];
      const index = this.comments.findIndex((comment) => comment === node);
      if (index > -1) {
        this.comments.splice(index, 1);
      }
    }

    if (node.__ngt_renderer__[NgtRendererClassId.type] === 'portal') {
      node.__ngt_renderer__[NgtRendererClassId.injectorFactory] = null!;
      const index = this.portals.findIndex((portal) => portal === node);
      if (index > -1) {
        this.portals.splice(index, 1);
      }
    }

    if (node.__ngt_renderer__[NgtRendererClassId.type] === 'compound') {
      node.__ngt_renderer__[NgtRendererClassId.localState] = null!;
      node.__ngt_renderer__[NgtRendererClassId.compounded] = undefined!;
      node.__ngt_renderer__[NgtRendererClassId.attributes] = null!;
      node.__ngt_renderer__[NgtRendererClassId.properties] = null!;
      node.__ngt_renderer__[NgtRendererClassId.queueOps].clear();
      node.__ngt_renderer__[NgtRendererClassId.queueOps] = null!;
      node.__ngt_renderer__[NgtRendererClassId.cleanUps].forEach((cleanUp) => cleanUp());
      node.__ngt_renderer__[NgtRendererClassId.cleanUps].clear();
      node.__ngt_renderer__[NgtRendererClassId.cleanUps] = null!;
    }

    if (node.__ngt_renderer__[NgtRendererClassId.ref]) {
      // nullify the ref on remove
      node.__ngt_renderer__[NgtRendererClassId.ref].nativeElement = null;
      node.__ngt_renderer__[NgtRendererClassId.ref] = undefined!;
    }

    node.__ngt_renderer__[NgtRendererClassId.parent] = null;
    for (const renderChild of node.__ngt_renderer__[NgtRendererClassId.children] || []) {
      if (renderChild.__ngt_renderer__[NgtRendererClassId.type] === 'instance' && parent) {
        removeThreeChild(parent, renderChild, true);
      }
      this.remove(renderChild, parent);
    }
    node.__ngt_renderer__[NgtRendererClassId.children] = null!;
    node.__ngt_renderer__[NgtRendererClassId.removed] = true;
    if (parent) {
      this.removeChild(parent, node);
    }
  }

  #firstNonInjectedDirective<T extends NgtHasValidateForRenderer>(dir: Type<T>) {
    let directive: T | undefined;

    let i = this.comments.length - 1;
    while (i >= 0) {
      const comment = this.comments[i];
      if (comment.__ngt_renderer__[NgtRendererClassId.removed]) {
        i--;
        continue;
      }
      const injector = comment.__ngt_renderer__[NgtRendererClassId.injectorFactory]?.();
      if (!injector) {
        i--;
        continue;
      }
      const instance = injector.get(dir, null);
      if (instance && instance.validate()) {
        directive = instance;
        break;
      }

      i--;
    }

    return directive;
  }

  #tryGetPortalStore() {
    let store: NgtStore | undefined;
    // we only care about the portal states because NgtStore only differs per Portal
    let i = this.portals.length - 1;
    while (i >= 0) {
      // loop through the portal state backwards to find the closest NgtStore
      const injector = this.portals[i].__ngt_renderer__[NgtRendererClassId.injectorFactory]?.();
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
