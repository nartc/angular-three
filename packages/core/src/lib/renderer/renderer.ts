import {
  ChangeDetectorRef,
  inject,
  Injectable,
  Renderer2,
  RendererFactory2,
  RendererType2,
} from '@angular/core';
import { ɵDomRendererFactory2 as DomRendererFactory2 } from '@angular/platform-browser';
import { injectNgtCatalogue } from '../catalogue';
import { injectNgtStore } from '../stores/store';
import { NgtAnyConstructor } from '../types';
import { getLocalState, prepare } from '../utils/instance';
import { is } from '../utils/is';
import { NgtRendererClassId } from './class-id';
import { injectNgtCompoundPrefixes } from './di';
import { NgtRendererNode, NgtRendererState } from './state';
import {
  attachThreeInstances,
  kebabToPascal,
  processThreeEvent,
  removeThreeChild,
  SPECIAL_DOM_TAG,
  SPECIAL_PROPERTIES,
} from './utils';

@Injectable()
export class NgtRendererFactory implements RendererFactory2 {
  readonly #domRendererFactory = inject(DomRendererFactory2);
  readonly #cdr = inject(ChangeDetectorRef);
  readonly #store = injectNgtStore();
  readonly #catalogue = injectNgtCatalogue();
  readonly #compoundPrefixes = injectNgtCompoundPrefixes();

  readonly #state = new NgtRendererState({
    store: this.#store,
    cdr: this.#cdr,
    compoundPrefixes: this.#compoundPrefixes,
  });

  #renderer?: NgtRenderer;

  createRenderer(hostElement: any, type: RendererType2 | null): Renderer2 {
    if (!this.#renderer) {
      const domRenderer = this.#domRendererFactory.createRenderer(hostElement, type);
      this.#renderer = new NgtRenderer(domRenderer, this.#state, this.#catalogue);
    }
    return this.#renderer;
  }
}

export class NgtRenderer implements Renderer2 {
  #firstCreateElement = false;

  constructor(
    private readonly delegate: Renderer2,
    private readonly state: NgtRendererState,
    private readonly catalogue: Record<string, NgtAnyConstructor>
  ) {}

  createElement(name: string, namespace?: string | null | undefined) {
    const element = this.delegate.createElement(name, namespace);

    if (!this.#firstCreateElement) {
      this.#firstCreateElement = true;
      return this.state.createNode('instance', this.state.rootScene);
    }

    if (this.state.isCompound(name)) return this.state.createNode('compound', element);
    // handle Portal to opt-out of normal rendering
    if (name === SPECIAL_DOM_TAG.NGT_PORTAL) return this.state.createNode('portal', element);

    // handle raw value
    if (name === SPECIAL_DOM_TAG.NGT_VALUE) {
      return this.state.createNode(
        'instance',
        Object.assign({ __ngt_renderer__: { rawValue: undefined } }, { __ngt__: { isRaw: true } })
      );
    }

    const { injectedArgs, store } = this.state.getCreationState();

    // handle ngt-primitive and fail fast when not met requirement
    if (name === SPECIAL_DOM_TAG.NGT_PRIMITIVE) {
      if (!injectedArgs[0]) throw new Error(`[NGT] ngt-primitive without args is invalid`);
      const object = injectedArgs[0];
      let localState = getLocalState(object);
      if (!localState) {
        prepare(object, { store, args: injectedArgs, primitive: true });
        localState = getLocalState(object);
      }

      if (!localState.store) {
        localState.store = store;
      }
      return this.state.createNode('instance', object);
    }

    const threeTag = name.startsWith('ngt') ? name.slice(4) : name;
    const threeName = kebabToPascal(threeTag);
    const threeTarget = this.catalogue[threeName];
    if (threeTarget) {
      const instance = prepare(new threeTarget(...injectedArgs), { store, args: injectedArgs });
      const node = this.state.createNode('instance', instance);
      const localState = node.__ngt_renderer__[NgtRendererClassId.localState]();
      if (localState) {
        if (is.geometry(instance)) {
          localState.attach = ['geometry'];
        } else if (is.material(instance)) {
          localState.attach = ['material'];
        }
      }

      return node;
    }

    return this.state.createNode('component', element);
  }

  createComment(value: string) {
    const comment = this.delegate.createComment(value);
    // TODO  The code in angular core has tNode that can be passed down to createComment.
    // But it is not right now. We'll ask the team later
    return this.state.createNode('comment', comment);
  }

  appendChild(parent: NgtRendererNode, newChild: NgtRendererNode): void {
    // TODO: just ignore text node for now
    if (newChild instanceof Text) return;

    if (newChild.__ngt_renderer__[NgtRendererClassId.type] === 'comment') {
      this.state.setParent(newChild, parent);
      return;
    }

    this.state.setParent(newChild, parent);
    this.state.addChild(parent, newChild);

    if (newChild.__ngt_renderer__[NgtRendererClassId.type] === 'portal') {
      this.state.processPortal(newChild);
      if (newChild.__ngt_renderer__[NgtRendererClassId.container]) {
        this.appendChild(parent, newChild.__ngt_renderer__[NgtRendererClassId.container]);
      }
      return;
    }

    if (parent.__ngt_renderer__[NgtRendererClassId.type] === 'portal') {
      this.state.processPortal(parent);
      if (parent.__ngt_renderer__[NgtRendererClassId.container]) {
        this.appendChild(parent.__ngt_renderer__[NgtRendererClassId.container], newChild);
      }
      return;
    }

    if (
      parent.__ngt_renderer__[NgtRendererClassId.type] === 'instance' &&
      newChild.__ngt_renderer__[NgtRendererClassId.type] === 'instance'
    ) {
      attachThreeInstances(parent, newChild);
      // here, we handle the special case of if the parent has compoundParent, which means that this is part of a compound component
      const closestGrandparentCompound = this.state.getClosestParentWithCompound(parent);
      if (!closestGrandparentCompound) return;
      if (newChild.__ngt_renderer__[NgtRendererClassId.compound]) {
        this.appendChild(closestGrandparentCompound, newChild);
      }
      return;
    }

    if (parent.__ngt_renderer__[NgtRendererClassId.type] === 'instance') {
      if (newChild.__ngt_renderer__[NgtRendererClassId.children].length) {
        for (const renderChild of newChild.__ngt_renderer__[NgtRendererClassId.children]) {
          this.appendChild(parent, renderChild);
        }
      }
      return;
    }

    if (parent.__ngt_renderer__[NgtRendererClassId.type] === 'compound') {
      // if compound doesn't have its instance set yet
      if (
        !parent.__ngt_renderer__[NgtRendererClassId.compounded] &&
        newChild.__ngt_renderer__[NgtRendererClassId.type] === 'instance'
      ) {
        // if child is indeed an ngtCompound
        if (newChild.__ngt_renderer__[NgtRendererClassId.compound]) {
          this.state.setCompoundInstance(parent, newChild);
        } else {
          // if not, we track the parent (that is supposedly the compound component) on this three instance
          if (!newChild.__ngt_renderer__[NgtRendererClassId.compoundParent]) {
            newChild.__ngt_renderer__[NgtRendererClassId.compoundParent] = parent;
          }
        }
      }

      // reset the compound if it's changed
      if (
        parent.__ngt_renderer__[NgtRendererClassId.compounded] &&
        newChild.__ngt_renderer__[NgtRendererClassId.type] === 'instance' &&
        newChild.__ngt_renderer__[NgtRendererClassId.compound] &&
        parent.__ngt_renderer__[NgtRendererClassId.compounded] !== newChild
      ) {
        this.state.setCompoundInstance(parent, newChild);
      }
    }

    if (
      newChild.__ngt_renderer__[NgtRendererClassId.type] === 'instance' &&
      !newChild.__ngt_renderer__[NgtRendererClassId.localState]().parent
    ) {
      // we'll try to get the grandparent instance here so that we can run appendChild with both instances
      const closestGrandparentInstance = this.state.getClosestParentWithInstance(parent);
      if (closestGrandparentInstance) {
        this.appendChild(closestGrandparentInstance, newChild);
      }
    }
  }

  insertBefore(
    parent: NgtRendererNode,
    newChild: NgtRendererNode,
    refChild: NgtRendererNode,
    isMove?: boolean | undefined
  ): void {
    if (!parent.__ngt_renderer__) return;
    this.appendChild(parent, newChild);
  }

  removeChild(
    parent: NgtRendererNode,
    oldChild: NgtRendererNode,
    isHostElement?: boolean | undefined
  ): void {
    if (
      parent.__ngt_renderer__[NgtRendererClassId.type] === 'instance' &&
      oldChild.__ngt_renderer__[NgtRendererClassId.type] === 'instance'
    ) {
      removeThreeChild(parent, oldChild, true);
      this.state.remove(oldChild, parent);
      return;
    }

    if (
      parent.__ngt_renderer__[NgtRendererClassId.type] === 'compound' &&
      parent.__ngt_renderer__[NgtRendererClassId.parent]
    ) {
      this.removeChild(parent.__ngt_renderer__[NgtRendererClassId.parent], oldChild, isHostElement);
      return;
    }

    if (parent.__ngt_renderer__[NgtRendererClassId.type] === 'instance') {
      this.state.remove(oldChild, parent);
      return;
    }

    const closestGrandparentInstance = this.state.getClosestParentWithInstance(parent);
    if (closestGrandparentInstance) {
      this.removeChild(closestGrandparentInstance, oldChild, isHostElement);
    }
    this.state.remove(oldChild, closestGrandparentInstance as NgtRendererNode);
  }

  parentNode(node: NgtRendererNode) {
    if (node.__ngt_renderer__?.[NgtRendererClassId.parent])
      return node.__ngt_renderer__[NgtRendererClassId.parent];
    return this.delegate.parentNode(node);
  }

  setAttribute(
    el: NgtRendererNode,
    name: string,
    value: string,
    namespace?: string | null | undefined
  ): void {
    if (el.__ngt_renderer__[NgtRendererClassId.type] === 'compound') {
      // we don't have the compound instance yet
      el.__ngt_renderer__[NgtRendererClassId.attributes][name] = value;
      if (!el.__ngt_renderer__[NgtRendererClassId.compounded]) {
        this.state.queueCompoundOperation(el, () => this.setAttribute(el, name, value, namespace));
        return;
      }

      this.setAttribute(el.__ngt_renderer__[NgtRendererClassId.compounded], name, value, namespace);
      return;
    }

    if (el.__ngt_renderer__[NgtRendererClassId.type] === 'instance') {
      this.state.applyAttribute(el, name, value);
    }
  }

  setProperty(el: NgtRendererNode, name: string, value: any): void {
    if (el.__ngt_renderer__[NgtRendererClassId.type] === 'compound') {
      // we don't have the compound instance yet
      el.__ngt_renderer__[NgtRendererClassId.properties][name] = value;
      if (!el.__ngt_renderer__[NgtRendererClassId.compounded]) {
        this.state.queueCompoundOperation(el, () => this.setProperty(el, name, value));
        return;
      }

      if (
        el.__ngt_renderer__[NgtRendererClassId.compounded].__ngt_renderer__[
          NgtRendererClassId.compound
        ]
      ) {
        Object.assign(
          el.__ngt_renderer__[NgtRendererClassId.compounded].__ngt_renderer__[
            NgtRendererClassId.compound
          ],
          {
            props: {
              ...el.__ngt_renderer__[NgtRendererClassId.compounded].__ngt_renderer__[
                NgtRendererClassId.compound
              ],
              [name]: value,
            },
          }
        );
      }
      this.setProperty(el.__ngt_renderer__[NgtRendererClassId.compounded], name, value);
      return;
    }

    if (el.__ngt_renderer__[NgtRendererClassId.type] === 'instance') {
      const parent =
        el.__ngt_renderer__[NgtRendererClassId.localState]().parent ||
        el.__ngt_renderer__[NgtRendererClassId.parent];
      if (
        el.__ngt_renderer__[NgtRendererClassId.localState]().isRaw &&
        name === SPECIAL_PROPERTIES.VALUE
      ) {
        el.__ngt_renderer__[NgtRendererClassId.rawValue] = value;
        this.appendChild(parent, el);
        return;
      }

      if (name === SPECIAL_PROPERTIES.ATTACH) {
        el.__ngt_renderer__[NgtRendererClassId.localState]().attach = Array.isArray(value)
          ? value.map((v) => v.toString())
          : value;
        this.appendChild(parent, el);
        return;
      }

      this.state.applyProperty(el, name, value);
    }
  }

  listen(
    target: NgtRendererNode,
    eventName: string,
    callback: (event: any) => boolean | void
  ): () => void {
    if (
      target.__ngt_renderer__[NgtRendererClassId.type] === 'instance' ||
      (target.__ngt_renderer__[NgtRendererClassId.type] === 'compound' &&
        target.__ngt_renderer__[NgtRendererClassId.compounded])
    ) {
      const instance = target.__ngt_renderer__[NgtRendererClassId.compounded] || target;
      const priority = target.__ngt_renderer__[NgtRendererClassId.localState]().priority;
      return processThreeEvent(instance, priority || 0, eventName, callback, this.state.rootCdr);
    }

    if (
      target.__ngt_renderer__[NgtRendererClassId.type] === 'compound' &&
      !target.__ngt_renderer__[NgtRendererClassId.compounded]
    ) {
      this.state.queueCompoundOperation(target, () => {
        target.__ngt_renderer__[NgtRendererClassId.cleanUps].add(
          this.listen(target, eventName, callback)
        );
      });
    }
    return () => {};
  }

  get data(): { [key: string]: any } {
    return this.delegate.data;
  }

  setValue = this.delegate.setValue.bind(this.delegate);
  destroy = this.delegate.destroy.bind(this.delegate);
  destroyNode = this.delegate.destroyNode;
  selectRootElement = this.delegate.selectRootElement.bind(this.delegate);
  nextSibling = this.delegate.nextSibling.bind(this.delegate);
  removeAttribute = this.delegate.removeAttribute.bind(this.delegate);
  addClass = this.delegate.addClass.bind(this.delegate);
  removeClass = this.delegate.removeClass.bind(this.delegate);
  setStyle = this.delegate.setStyle.bind(this.delegate);
  removeStyle = this.delegate.removeStyle.bind(this.delegate);
  createText = this.delegate.createText.bind(this.delegate);
}
