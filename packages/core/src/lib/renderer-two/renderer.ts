import { inject, Injectable, Renderer2, RendererFactory2, RendererType2 } from '@angular/core';
import { ɵDomRendererFactory2 as DomRendererFactory2 } from '@angular/platform-browser';

@Injectable()
export class NgtRendererFactory2 implements RendererFactory2 {
  readonly #domRendererFactory = inject(DomRendererFactory2);

  createRenderer(hostElement: any, type: RendererType2 | null): Renderer2 {
    const domRenderer = this.#domRendererFactory.createRenderer(hostElement, type);
    return new NgtRenderer2(domRenderer);
  }
}

export class NgtRenderer2 implements Renderer2 {
  constructor(private readonly delegate: Renderer2) {}

  createElement(name: string, namespace?: string | null | undefined) {
    console.log('createElement -->', { name });
    return this.delegate.createElement(name, namespace);
  }

  createComment(value: string) {
    console.log('createComment -->');
    return this.delegate.createComment(value);
  }

  createText(value: string) {
    console.log('createText -->', { value });
    return this.delegate.createText(value);
  }

  appendChild(parent: any, newChild: any): void {
    console.log('appendChild -->', { parent, newChild });
    return this.delegate.appendChild(parent, newChild);
  }

  insertBefore(parent: any, newChild: any, refChild: any, isMove?: boolean | undefined): void {
      console.log('insertBefore -->', {parent, newChild, refChild, isMove});
      return this.delegate.insertBefore(parent, newChild, refChild, isMove);
  }

  removeChild(parent: any, oldChild: any, isHostElement?: boolean | undefined): void {
      console.log('removeChild -->', {parent, oldChild, isHostElement});
      return this.delegate.removeChild(parent, oldChild, isHostElement);
  }

  parentNode(node: any) {
      console.log('parentNode -->', {node});
      return this.delegate.parentNode(node);
  }

  setAttribute(el: any, name: string, value: string, namespace?: string | null | undefined): void {
      console.log('setAttribute -->', {el, name, value, namespace});
      return this.delegate.setAttribute(el, name, value, namespace);
  }

  setProperty(el: any, name: string, value: any): void {
      console.log('setProperty -->', {el, name, value});
      return this.delegate.setProperty(el, name, value);
  }

  setValue(node: any, value: string): void {
      console.log('setValue -->', {node, value});
      return this.delegate.setValue(node, value);
  }

  listen(target: any, eventName: string, callback: (event: any) => boolean | void): () => void {
      console.log('listen -->', {target, eventName, callback});
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
