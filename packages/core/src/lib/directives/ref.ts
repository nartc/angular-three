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

@Directive({
  selector: '[ref]',
  standalone: true,
})
export class NgtRef<T> implements NgtHasValidateForRenderer {
  readonly #templateRef = inject(TemplateRef);
  readonly #vcr = inject(ViewContainerRef);
  #view?: EmbeddedViewRef<unknown>;

  #injectedRef?: ElementRef<T>;
  #injected = false;
  shouldCreateView = true;

  @Input() set ref(ref: ElementRef<T> | null) {
    if (!ref) return;
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
