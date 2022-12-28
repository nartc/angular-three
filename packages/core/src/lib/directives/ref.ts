import {
  Directive,
  ElementRef,
  EmbeddedViewRef,
  inject,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { NgtHasValidateForRenderer } from '../types';
import { injectNgtArgs, NgtArgs } from './args';

@Directive({
  selector: '[ref]',
  standalone: true,
  hostDirectives: [NgtArgs],
})
export class NgtRef<T> implements NgtHasValidateForRenderer {
  readonly #ngtArgs = injectNgtArgs({ host: true });
  readonly #templateRef = inject(TemplateRef);
  readonly #vcr = inject(ViewContainerRef);
  #view?: EmbeddedViewRef<unknown>;

  #injectedRef?: ElementRef<T>;
  #injected = false;
  shouldCreateView = true;

  constructor() {
    this.#ngtArgs.shouldCreateView = false;
  }

  @Input() set ref(input: ElementRef<T> | [ElementRef<T>, any[]] | null) {
    if (!input) return;
    const [ref, args] = Array.isArray(input) ? input : [input, undefined];
    if (args) {
      this.#ngtArgs.args = args;
    }
    this.#injected = false;
    this.#injectedRef = ref;
    if (this.shouldCreateView) {
      this.#createView();
    }
  }

  get ref(): ElementRef<T> | null {
    if (!this.#injected && this.#injectedRef) {
      this.#injected = true;
      return this.#injectedRef;
    }
    return null;
  }

  validate() {
    return !this.#injected && !!this.#injectedRef && !this.#injectedRef.nativeElement;
  }

  #createView() {
    if (this.#view && !this.#view.destroyed) {
      this.#view.destroy();
    }
    this.#view = this.#vcr.createEmbeddedView(this.#templateRef);
    this.#view.detectChanges();
  }
}
