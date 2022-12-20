import { NgtAnyRecord } from '@angular-three/core';
import {
  inject,
  Injectable,
  Provider,
  Renderer2,
  RendererFactory2,
  RendererStyleFlags2,
  RendererType2,
} from '@angular/core';
import { ɵDomRendererFactory2 as DomRendererFactory } from '@angular/platform-browser';
import { injectNgtCatalogue } from '../catalogue';
import { NgtAnyConstructor, NgtInstanceLocalState, NgtInstanceNode } from '../types';
import { instanceLocalState } from '../utils/instance-local-state';
import { prepare } from '../utils/prepare';
import { RendererState } from './state';

const ANNOTATED_FLAGS = {
  NGT_SCENE: 'NGT_SCENE',
  NGT_WRAPPER: 'NGT_WRAPPER',
} as const;

const ATTRIBUTES = {
  BEFORE_RENDER_PRIORITY: 'beforeRenderPriority',
  ATTACH: 'attach',
  WRAPPER_MODE: 'wrapperMode',
} as const;

const EVENTS = {
  BEFORE_RENDER: 'beforeRender',
} as const;

const SPECIAL_TAGS = {
  PORTAL: 'ngt-portal',
  PRIMITIVE: 'ngt-primitive',
  CANVAS_CONTAINER: 'ngt-canvas-container',
} as const;

@Injectable()
export class NgtRendererFactory implements RendererFactory2 {
  private readonly delegateDomRendererFactory = inject(DomRendererFactory);
  private readonly catalogue = injectNgtCatalogue();
  private readonly rendererStateMap = new Map<NgtInstanceNode, RendererState>();
  private defaultRenderer?: NgtRenderer;

  createRenderer(hostElement: any, type: RendererType2 | null): Renderer2 {
    if (!hostElement || !type) return this.createRendererIfNotExist(hostElement, type);

    const localState = ensureLocalState(hostElement);
    const rendererState = RendererState.init(hostElement, localState, this.rendererStateMap);
    
    const componentClass = (type as NgtAnyRecord)['type'];

    if (componentClass[ANNOTATED_FLAGS.NGT_SCENE]) {
      rendererState.setType('scene');
      console.log(rendererState);
    }

    console.log('createRenderer -->', {
      hostElement,
      type,
      rendererStateMap: this.rendererStateMap,
    });

    if (!this.defaultRenderer) {
      this.defaultRenderer = new NgtRenderer(
        this.delegateDomRendererFactory.createRenderer(hostElement, type),
        this.rendererStateMap,
        this.catalogue
      );
    }
    return this.defaultRenderer;
  }

  private createRendererIfNotExist(hostElement: any, type: RendererType2 | null): Renderer2 {
    if (!this.defaultRenderer) {
      const delegateRenderer = this.delegateDomRendererFactory.createRenderer(hostElement, type);
      this.defaultRenderer = new NgtRenderer(
        delegateRenderer,
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
    private rendererStateMap: Map<NgtInstanceNode, RendererState>,
    private catalogue: Record<string, NgtAnyConstructor>
  ) {}

  appendChild(parent: any, newChild: any): void {
    const [parentRendererState, childRendererState] = this.prepareBeforeAppend(parent, newChild);

    if (!newChild['__ngContext__'] && childRendererState.instanceLocalState.isThree) {
      newChild['__ngContext__'] = parent['__ngContext__'];
    }

    parent = parentRendererState.instanceNode;
    newChild = childRendererState.instanceNode;

    console.log('appendChild -->', {
      parent,
      newChild,
      rendererStateMap: this.rendererStateMap,
      parentRendererState,
      childRendererState,
    });

    try {
      this.delegateRenderer.appendChild(parent, newChild);
    } catch (e) {
      console.log('skip appendChild error');
    }
  }

  createComment(value: string): any {
    console.log('createComment -->', { value });
    return this.delegateRenderer.createComment(value);
  }

  createElement(name: string, namespace?: string | null): any {
    console.log('createElement -->', { name, namespace });
    const element = this.delegateRenderer.createElement(name, namespace);
    const localState = ensureLocalState(element, { primitive: name === SPECIAL_TAGS.PRIMITIVE });
    const rendererState = RendererState.init(element, localState, this.rendererStateMap);

    if (name === SPECIAL_TAGS.PORTAL) {
      rendererState.setType('portal');
      return element;
    }

    const { injectedRef, injectedArgs, store, attach } = rendererState.getInitPhaseStates();
    console.log({ injectedRef, injectedArgs, store, attach });

    const threeTag = name.startsWith('ngt') && !name.startsWith('ngts') ? name.slice(4) : name;
    const threeName = kebabToPascal(threeTag);
    const threeTarget = this.catalogue[threeName];

    if (threeTarget) {
      const instance = prepare(new threeTarget(...injectedArgs), {
        args: injectedArgs,
        attach,
        isThree: true,
      });
      rendererState.replace(instance);
      return instance;
    }

    return element;
  }

  insertBefore(parent: any, newChild: any, refChild: any, isMove?: boolean): void {
    console.log('insertBefore -->', { parent, newChild, refChild, isMove });
    this.delegateRenderer.insertBefore(parent, newChild, refChild, isMove);
  }

  listen(target: any, eventName: string, callback: (event: any) => boolean | void): () => void {
    console.log('listen -->', { target, eventName, callback });
    return this.delegateRenderer.listen(target, eventName, callback);
  }

  parentNode(node: any): any {
    console.log('parentNode -->', { node });
    return this.delegateRenderer.parentNode(node);
  }

  removeChild(parent: any, oldChild: any, isHostElement?: boolean): void {
    console.log('removeChild -->', { parent, oldChild, isHostElement });
    this.delegateRenderer.removeChild(parent, oldChild, isHostElement);
  }

  setAttribute(el: any, name: string, value: string, namespace?: string | null): void {
    console.log('setAttribute -->', { el, name, value, namespace });
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

  private prepareBeforeAppend(parent: any, child: any): [RendererState, RendererState] {
    const childLocalState = ensureLocalState(child);
    const parentLocalState = ensureLocalState(parent);

    const childRendererState = RendererState.init(child, childLocalState, this.rendererStateMap);
    let parentRendererState = RendererState.init(parent, parentLocalState, this.rendererStateMap);

    parentRendererState.upsertChild(childRendererState);

    if (parentRendererState.isScene) {
      parentRendererState = parentRendererState.tryAssignRootScene();
    }

    return [parentRendererState, this.rendererStateMap.get(child)!];
  }

  /**
   * Renderer API that we might not need
   */

  get data(): { [p: string]: any } {
    return this.delegateRenderer.data;
  }

  createText(value: string): any {
    console.log('createText -->', { value });
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

function ensureLocalState(
  instance: any,
  partialState?: Partial<NgtInstanceLocalState>
): NgtInstanceLocalState {
  let localState = instanceLocalState(instance);
  if (!localState) {
    prepare(instance, partialState);
    localState = instanceLocalState(instance);
  }
  return localState!;
}

function kebabToPascal(str: string): string {
  // split the string at each hyphen
  const parts = str.split('-');

  // map over the parts, capitalizing the first letter of each part
  const pascalParts = parts.map((part) => {
    return part.charAt(0).toUpperCase() + part.slice(1);
  });

  // join the parts together to create the final PascalCase string
  return pascalParts.join('');
}

export function provideNgtRenderer(): Provider {
  return { provide: RendererFactory2, useClass: NgtRendererFactory };
}
