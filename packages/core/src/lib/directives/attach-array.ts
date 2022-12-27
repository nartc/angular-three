import {
  Directive,
  EmbeddedViewRef,
  inject,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import type { NgtHasValidateForRenderer } from '../types';
import { injectNgtArgs, NgtArgs } from './args';

@Directive({
  selector: '[attachArray]',
  standalone: true,
  hostDirectives: [NgtArgs],
})
export class NgtAttachArray implements NgtHasValidateForRenderer {
  readonly #ngtArgs = injectNgtArgs({ host: true });

  readonly #templateRef = inject(TemplateRef);
  readonly #vcr = inject(ViewContainerRef);
  #view?: EmbeddedViewRef<unknown>;

  #injectedAttachArray: Array<string> = [];
  #injected = false;

  constructor() {
    this.#ngtArgs.shouldCreateView = false;
  }

  @Input() set attachArray(
    inputs: Array<string | number> | [Array<string | number>, any[]] | null
  ) {
    if (!inputs) return;
    const [attachArray, args] = this.#processArrayInputs(inputs);
    if (!attachArray.length) return;
    if (args) {
      this.#ngtArgs.args = args;
    }
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

  #processArrayInputs(
    inputs: Array<string | number> | [Array<string | number>, any[]]
  ): [Array<string | number>, any[]] {
    if (
      Array.isArray(inputs) &&
      inputs.length === 2 &&
      (inputs as [Array<string | number>, any[]]).every((item) => Array.isArray(item))
    ) {
      return inputs as [Array<string | number>, any[]];
    }

    return [inputs as Array<string | number>, undefined as unknown as any[]];
  }
}
