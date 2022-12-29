import {
  Directive,
  EmbeddedViewRef,
  inject,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import type { NgtHasValidateForRenderer } from '../types';

@Directive({
  selector: '[attachArray]',
  standalone: true,
})
export class NgtAttachArray implements NgtHasValidateForRenderer {
  readonly #templateRef = inject(TemplateRef);
  readonly #vcr = inject(ViewContainerRef);
  #view?: EmbeddedViewRef<unknown>;

  #injectedAttachArray: Array<string> = [];
  #injected = false;

  @Input() set attachArray(attachArray: Array<string | number> | null) {
    if (!attachArray || !attachArray.length) return;
    this.#injected = false;
    this.#injectedAttachArray = attachArray.map((item) => item.toString());
    this.#createView();
  }

  get attachArray(): Array<string> | null {
    if (!this.#injected && this.#injectedAttachArray.length) {
      this.#injected = true;
      return this.#injectedAttachArray;
    }
    return null;
  }

  validate() {
    return !this.#injected && !!this.#injectedAttachArray.length;
  }

  #createView() {
    if (this.#view && !this.#view.destroyed) {
      this.#view.destroy();
    }
    this.#view = this.#vcr.createEmbeddedView(this.#templateRef);
    this.#view.detectChanges();
  }
}
