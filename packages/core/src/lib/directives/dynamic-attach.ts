import {
  Directive,
  EmbeddedViewRef,
  inject,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { NgtRxStore } from '../stores/rx-store';
import type { NgtAttachFunction, NgtHasValidateForRenderer, NgtState } from '../types';

@Directive({
  selector: '[dynamicAttach]',
  standalone: true,
})
export class NgtDynamicAttach implements NgtHasValidateForRenderer {
  readonly #templateRef = inject(TemplateRef);
  readonly #vcr = inject(ViewContainerRef);
  #view?: EmbeddedViewRef<unknown>;

  #injectedDynamicAttach: string[] | NgtAttachFunction = [];
  #injected = false;

  @Input() set dynamicAttach(dynamicAttach: Array<string | number> | NgtAttachFunction | null) {
    if (!dynamicAttach || !dynamicAttach.length) return;
    this.#injectedDynamicAttach = Array.isArray(dynamicAttach)
      ? dynamicAttach.map((item) => item.toString())
      : dynamicAttach;
    this.#injected = false;
    this.#createView();
  }

  get dynamicAttach(): string[] | NgtAttachFunction | null {
    if (
      !this.#injected &&
      (typeof this.#injectedDynamicAttach === 'function' || this.#injectedDynamicAttach.length)
    ) {
      this.#injected = true;
      return this.#injectedDynamicAttach;
    }
    return null;
  }

  validate() {
    const isValidatedFunction = typeof this.#injectedDynamicAttach === 'function';
    const isValidatedArray =
      Array.isArray(this.#injectedDynamicAttach) && !!this.#injectedDynamicAttach.length;
    return !this.#injected && (isValidatedFunction || isValidatedArray);
  }

  #createView() {
    if (this.#view && !this.#view.destroyed) {
      this.#view.destroy();
    }
    this.#view = this.#vcr.createEmbeddedView(this.#templateRef);
    this.#view.detectChanges();
  }
}

export function createAttachFunction<TChild, TParent extends object>(
  callback: (params: {
    parent: TParent;
    child: TChild;
    store: NgtRxStore<NgtState>;
  }) => ReturnType<NgtAttachFunction<TChild, TParent>>
) {
  return ((parent: TParent, child: TChild, store: NgtRxStore<NgtState>) => {
    return callback({ parent, child, store });
  }) as NgtAttachFunction<TChild, TParent>;
}
