import {
  ChangeDetectorRef,
  inject,
  Injectable,
  Renderer2,
  RendererFactory2,
  RendererType2,
} from '@angular/core';
import { ɵDomRendererFactory2 as DomRendererFactory } from '@angular/platform-browser';
import { injectNgtCatalogue } from '../catalogue';
import { injectNgtStore, NgtStore } from '../stores/store';
import { NgtAnyConstructor } from '../types';

@Injectable()
export class NgtRendererFactory implements RendererFactory2 {
  readonly #delegateDomRendererFactory = inject(DomRendererFactory);
  readonly #catalogue = injectNgtCatalogue();
  readonly #rootCdr = inject(ChangeDetectorRef);
  readonly #rootStore = injectNgtStore();
  #defaultRenderer?: NgtRenderer;

  createRenderer(hostElement: any, type: RendererType2 | null): Renderer2 {
    console.log('createRenderer -->', { rootStore: this.#rootStore });
    if (!hostElement || !type) return this.#createRendererIfNotExist(hostElement, type);
    return this.#createRendererIfNotExist(hostElement, type);
  }

  #createRendererIfNotExist(hostElement: any, type: RendererType2 | null): Renderer2 {
    if (!this.#defaultRenderer) {
      this.#defaultRenderer = new NgtRenderer(
        this.#delegateDomRendererFactory.createRenderer(hostElement, type),
        this.#catalogue,
        this.#rootCdr,
        this.#rootStore
      );
    }
    return this.#defaultRenderer;
  }
}

export class NgtRenderer implements Renderer2 {
  constructor(
    private delegateRenderer: Renderer2,
    private catalogue: Record<string, NgtAnyConstructor>,
    private rootCdr: ChangeDetectorRef,
    private rootStore: NgtStore
  ) {}

  createElement(name: string, namespace?: string | null | undefined) {
    console.log('createElement -->', { name, namespace });
    return this.delegateRenderer.createElement(name, namespace);
  }

  createComment(value: string) {
    console.log('createComment -->', { value });
    return this.delegateRenderer.createComment(value);
  }

  createText(value: string) {
    console.log('createText -->', { value });
    return this.delegateRenderer.createText(value);
  }

  appendChild(parent: any, newChild: any): void {
    console.log('appendChild -->', { parent, newChild });
    this.delegateRenderer.appendChild(parent, newChild);
  }

  insertBefore(parent: any, newChild: any, refChild: any, isMove?: boolean | undefined): void {
    console.log('insertBefore -->', { parent, newChild, refChild });
    this.delegateRenderer.insertBefore(parent, newChild, refChild, isMove);
  }

  removeChild(parent: any, oldChild: any, isHostElement?: boolean | undefined): void {
    this.delegateRenderer.removeChild(parent, oldChild, isHostElement);
  }

  selectRootElement(selectorOrNode: any, preserveContent?: boolean | undefined) {
    return this.delegateRenderer.selectRootElement(selectorOrNode, preserveContent);
  }

  parentNode(node: any) {
    console.log('parentNode -->', { node });
    return this.delegateRenderer.parentNode(node);
  }

  nextSibling(node: any) {
    console.log('nextSibling -->', { node });
    return this.delegateRenderer.nextSibling(node);
  }

  setAttribute(el: any, name: string, value: string, namespace?: string | null | undefined): void {
    console.log('setAttribute -->', { el, name, value });
    this.delegateRenderer.setAttribute(el, name, value, namespace);
  }

  setProperty(el: any, name: string, value: any): void {
    console.log('setProperty -->', { el, name, value });
    this.delegateRenderer.setProperty(el, name, value);
  }

  setValue(node: any, value: string): void {
    console.log('setValue -->', { node, value });
    this.delegateRenderer.setValue(node, value);
  }

  listen(target: any, eventName: string, callback: (event: any) => boolean | void): () => void {
    console.log('listen -->', { target, eventName, callback });
    return this.delegateRenderer.listen(target, eventName, callback);
  }

  get data(): { [key: string]: any } {
    return this.delegateRenderer.data;
  }

  destroyNode = null;
  destroy = this.delegateRenderer.destroy.bind(this.delegateRenderer);
  removeAttribute = this.delegateRenderer.removeAttribute.bind(this.delegateRenderer);
  addClass = this.delegateRenderer.addClass.bind(this.delegateRenderer);
  removeClass = this.delegateRenderer.removeClass.bind(this.delegateRenderer);
  setStyle = this.delegateRenderer.setStyle.bind(this.delegateRenderer);
  removeStyle = this.delegateRenderer.removeStyle.bind(this.delegateRenderer);
}
