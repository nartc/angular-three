import {
  injectNgtCatalogue,
  NgtAnyConstructor,
  NgtInstanceNode,
  NgtInstanceRendererState,
} from '@angular-three/core';
import {
  DebugNode,
  inject,
  Injectable,
  Renderer2,
  RendererFactory2,
  RendererStyleFlags2,
  RendererType2,
} from '@angular/core';
import { ɵDomRendererFactory2 as DomRendererFactory } from '@angular/platform-browser';

@Injectable()
export class NgtRendererFactory implements RendererFactory2 {
  private readonly delegateDomRendererFactory = inject(DomRendererFactory);
  private readonly catalogue = injectNgtCatalogue();
  private readonly debugNodeMap = new Map<NgtInstanceNode, DebugNode>();
  private readonly rendererStateMap = new Map<NgtInstanceNode, NgtInstanceRendererState>();
  private defaultRenderer?: NgtRenderer;

  createRenderer(hostElement: any, type: RendererType2 | null): Renderer2 {
    if (!this.defaultRenderer) {
      this.defaultRenderer = new NgtRenderer(
        this.delegateDomRendererFactory.createRenderer(hostElement, type),
        this.debugNodeMap,
        this.rendererStateMap,
        this.catalogue
      );
    }
    return this.defaultRenderer;
  }
}

export class NgtRenderer implements Renderer2 {
  constructor(
    private delegateRenderer: Renderer2,
    private debugNodeMap: Map<NgtInstanceNode, DebugNode>,
    private rendererStateMap: Map<NgtInstanceNode, NgtInstanceRendererState>,
    private catalogue: Record<string, NgtAnyConstructor>
  ) {}

  appendChild(parent: any, newChild: any): void {
    this.delegateRenderer.appendChild(parent, newChild);
  }

  createComment(value: string): any {
    return this.delegateRenderer.createComment(value);
  }

  createElement(name: string, namespace?: string | null): any {
    return this.delegateRenderer.createElement(name, namespace);
  }

  insertBefore(parent: any, newChild: any, refChild: any, isMove?: boolean): void {
    this.delegateRenderer.insertBefore(parent, newChild, refChild, isMove);
  }

  listen(target: any, eventName: string, callback: (event: any) => boolean | void): () => void {
    return this.delegateRenderer.listen(target, eventName, callback);
  }

  parentNode(node: any): any {
    return this.delegateRenderer.parentNode(node);
  }

  removeChild(parent: any, oldChild: any, isHostElement?: boolean): void {
    this.delegateRenderer.removeChild(parent, oldChild, isHostElement);
  }

  setAttribute(el: any, name: string, value: string, namespace?: string | null): void {
    this.delegateRenderer.setAttribute(el, name, value, namespace);
  }

  setProperty(el: any, name: string, value: any): void {
    this.delegateRenderer.setProperty(el, name, value);
  }

  setValue(node: any, value: string): void {
    this.delegateRenderer.setValue(node, value);
  }

  get data(): { [p: string]: any } {
    return this.delegateRenderer.data;
  }

  createText(value: string): any {
    return this.delegateRenderer.createText(value);
  }

  removeAttribute(el: any, name: string, namespace?: string | null): void {
    this.delegateRenderer.removeAttribute(el, name, namespace);
  }

  destroyNode(node: any): void {
    this.delegateRenderer.destroyNode?.(node);
  }

  nextSibling(node: any): any {
    return this.delegateRenderer.nextSibling(node);
  }

  addClass(el: any, name: string): void {
    this.delegateRenderer.addClass(el, name);
  }

  removeClass(el: any, name: string): void {
    this.delegateRenderer.removeClass(el, name);
  }

  setStyle(el: any, style: string, value: any, flags?: RendererStyleFlags2): void {
    this.delegateRenderer.setStyle(el, style, value, flags);
  }

  removeStyle(el: any, style: string, flags?: RendererStyleFlags2): void {
    this.delegateRenderer.removeStyle(el, style, flags);
  }

  selectRootElement(selectorOrNode: any, preserveContent?: boolean): any {
    return this.delegateRenderer.selectRootElement(selectorOrNode, preserveContent);
  }

  destroy(): void {
    this.delegateRenderer.destroy();
  }
}
