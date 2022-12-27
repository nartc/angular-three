import {
  Directive,
  EmbeddedViewRef,
  inject,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import type { NgtHasValidateForRenderer } from '../types';
import { createInject } from '../utils/di';

@Directive({
  selector: '[args]',
  standalone: true,
})
export class NgtArgs implements NgtHasValidateForRenderer {
  readonly #templateRef = inject(TemplateRef);
  readonly #vcr = inject(ViewContainerRef);
  #view?: EmbeddedViewRef<unknown>;

  #injectedArgs: any[] = [];
  #injected = false;
  shouldCreateView = true;

  @Input() set args(args: any[] | null) {
    if (args == null || !Array.isArray(args)) return;
    if (args.length === 1 && args[0] === null) return;
    this.#injected = false;
    this.#injectedArgs = args;
    if (this.shouldCreateView) {
      this.#createView();
    }
  }

  get args() {
    if (!this.#injected && this.#injectedArgs.length) {
      this.#injected = true;
      return this.#injectedArgs;
    }
    return null;
  }

  validate() {
    return !this.#injected && !!this.#injectedArgs.length;
  }

  #createView() {
    if (this.#view && !this.#view.destroyed) {
      this.#view.destroy();
    }
    this.#view = this.#vcr.createEmbeddedView(this.#templateRef);
    this.#view.detectChanges();
  }
}

export const injectNgtArgs = createInject(NgtArgs);
