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
  selector: '[attachFn]',
  standalone: true,
})
export class NgtAttachFn implements NgtHasValidateForRenderer {
  readonly #templateRef = inject(TemplateRef);
  readonly #vcr = inject(ViewContainerRef);
  #view?: EmbeddedViewRef<unknown>;

  #injectedAttachFn?: NgtAttachFunction;
  #injected = false;

  @Input() set attachFn(attachFn: NgtAttachFunction | null) {
    if (!attachFn) return;
    this.#injected = false;
    this.#injectedAttachFn = attachFn;
    this.#createView();
  }

  get attachFn(): NgtAttachFunction | null {
    if (!this.#injected && this.#injectedAttachFn) {
      this.#injected = true;
      return this.#injectedAttachFn;
    }
    return null;
  }

  validate() {
    return !this.#injected && !!this.#injectedAttachFn;
  }

  #createView() {
    if (this.#view && !this.#view.destroyed) {
      this.#view.destroy();
    }
    this.#view = this.#vcr.createEmbeddedView(this.#templateRef);
    this.#view.detectChanges();
  }
}

export function createAttachFn<TChild, TParent extends object>(
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
