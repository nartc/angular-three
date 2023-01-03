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
import { attachThreeInstances, kebabToPascal } from '../renderer/utils';
import { injectNgtStore } from '../stores/store';
import { NgtAnyConstructor } from '../types';
import { prepare } from '../utils/instance';
import { is } from '../utils/is';
import { injectNgtCompoundPrefixes } from './di';
import { NgtRendererNode, NgtRendererState } from './state';

@Injectable()
export class NgtRendererFactory2 implements RendererFactory2 {
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

  #renderer?: NgtRenderer2;

  createRenderer(hostElement: any, type: RendererType2 | null): Renderer2 {
    if (!this.#renderer) {
      const domRenderer = this.#domRendererFactory.createRenderer(hostElement, type);
      this.#renderer = new NgtRenderer2(domRenderer, this.#state, this.#catalogue);
    }
    return this.#renderer;
  }
}

export class NgtRenderer2 implements Renderer2 {
  #firstCreateElement = false;

  constructor(
    private readonly delegate: Renderer2,
    private readonly state: NgtRendererState,
    private readonly catalogue: Record<string, NgtAnyConstructor>
  ) {}

  createElement(name: string, namespace?: string | null | undefined) {
    console.log('createElement -->', { name });

    const element = this.delegate.createElement(name, namespace);

    if (!this.#firstCreateElement) {
      this.#firstCreateElement = true;
      return new NgtRendererNode('three', this.state.rootScene, element);
    }

    if (this.state.isCompound(name)) {
      const node = new NgtRendererNode('compound', element);
      this.state.addNode(node);
      return node;
    }

    const { injectedRef, injectedArgs, attach, store } = this.state.getCreationState();

    const threeTag = name.startsWith('ngt') ? name.slice(4) : name;
    const threeName = kebabToPascal(threeTag);
    const threeTarget = this.catalogue[threeName];
    if (threeTarget) {
      const instance = prepare(new threeTarget(...injectedArgs), {
        store,
        attach,
        args: injectedArgs,
      });
      const node = new NgtRendererNode('three', instance);
      const localState = node.localState;
      if (localState) {
        if (!attach) {
          if (is.geometry(instance)) {
            localState.attach = ['geometry'];
          } else if (is.material(instance)) {
            localState.attach = ['material'];
          }
        }
      }

      if (injectedRef) injectedRef.nativeElement = instance;
      return node;
    }

    const node = new NgtRendererNode('component', element);
    this.state.addNode(node);
    return node;
  }

  createComment(value: string) {
    const comment = this.delegate.createComment(value);
    const node = new NgtRendererNode('comment', comment);
    this.state.addNode(node);
    return node;
  }

  createText(value: string) {
    console.log('createText -->', { value });
    return this.delegate.createText(value);
  }

  appendChild(parent: NgtRendererNode, newChild: NgtRendererNode): void {
    console.log('appendChild -->', { parent, newChild });

    if (!newChild.parent) {
      newChild.setParent(parent);
    }
    parent.addChild(newChild);

    if (parent.instance && newChild.instance) {
      attachThreeInstances(parent.instance, newChild.instance);
      return;
    }

    let grandParent = parent.parent;
    while (grandParent !== null && !grandParent.secondaryElement) {
      if (grandParent.parent === null) {
        break;
      }
      grandParent = grandParent.parent;
    }

    if (grandParent?.secondaryElement && newChild.element) {
      this.delegate.appendChild(grandParent.secondaryElement, newChild.element);
    }
  }

  insertBefore(
    parent: NgtRendererNode,
    newChild: NgtRendererNode,
    refChild: NgtRendererNode,
    isMove?: boolean | undefined
  ): void {
    if (newChild.secondaryElement) {
      this.delegate.insertBefore(parent, newChild.secondaryElement, refChild, isMove);
      return;
    }
    if (!(parent instanceof NgtRendererNode) || !(newChild instanceof NgtRendererNode)) return;
    parent.removeChild(refChild);
    this.appendChild(parent, newChild);
    console.log('insertBefore -->', { parent, newChild, refChild, isMove });
  }

  removeChild(
    parent: NgtRendererNode,
    oldChild: NgtRendererNode,
    isHostElement?: boolean | undefined
  ): void {
    console.log('removeChild -->', { parent, oldChild, isHostElement });
    return this.delegate.removeChild(parent, oldChild, isHostElement);
  }

  parentNode(node: NgtRendererNode) {
    console.log('parentNode -->', { node });
    if (node.parent) return node.parent;
    return this.delegate.parentNode(node);
  }

  setAttribute(
    el: NgtRendererNode,
    name: string,
    value: string,
    namespace?: string | null | undefined
  ): void {
    console.log('setAttribute -->', { el, name, value, namespace });
    return this.delegate.setAttribute(el, name, value, namespace);
  }

  setProperty(el: NgtRendererNode, name: string, value: any): void {
    console.log('setProperty -->', { el, name, value });
    return this.delegate.setProperty(el, name, value);
  }

  setValue(node: NgtRendererNode, value: string): void {
    console.log('setValue -->', { node, value });
    if (node.element) return this.delegate.setValue(node.element, value);
    return this.delegate.setValue(node, value);
  }

  listen(
    target: NgtRendererNode,
    eventName: string,
    callback: (event: any) => boolean | void
  ): () => void {
    console.log('listen -->', { target, eventName, callback });
    return this.delegate.listen(target, eventName, callback);
  }

  get data(): { [key: string]: any } {
    return this.delegate.data;
  }
  destroy = this.delegate.destroy.bind(this.delegate);
  destroyNode = this.delegate.destroyNode;
  selectRootElement = this.delegate.selectRootElement.bind(this.delegate);
  nextSibling = this.delegate.nextSibling.bind(this.delegate);
  removeAttribute = this.delegate.removeAttribute.bind(this.delegate);
  addClass = this.delegate.addClass.bind(this.delegate);
  removeClass = this.delegate.removeClass.bind(this.delegate);
  setStyle = this.delegate.setStyle.bind(this.delegate);
  removeStyle = this.delegate.removeStyle.bind(this.delegate);
}
