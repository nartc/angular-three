import {
  Directive,
  EmbeddedViewRef,
  inject,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import type { RxState } from '@rx-angular/state';
import { injectNgtStore } from '../store';
import type { NgtAttachFunction, NgtHasValidateForRenderer, NgtState } from '../types';
import { injectNgtArgs, NgtArgs } from './args';

@Directive({
  selector: '[attachFn]',
  standalone: true,
  hostDirectives: [NgtArgs],
})
export class NgtAttachFn implements NgtHasValidateForRenderer {
  readonly store = injectNgtStore({ skipSelf: true });
  private readonly ngtArgs = injectNgtArgs({ host: true });

  private readonly templateRef = inject(TemplateRef);
  private readonly vcr = inject(ViewContainerRef);
  private view?: EmbeddedViewRef<unknown>;

  private injectedAttachFn?: NgtAttachFunction;
  private injected = false;

  constructor() {
    this.ngtArgs.shouldCreateView = false;
  }

  @Input() set attachFn(inputs: NgtAttachFunction | [NgtAttachFunction, any[]] | null) {
    if (!inputs) return;
    const [attachFn, args] = Array.isArray(inputs) ? inputs : [inputs, undefined];
    if (args) {
      this.ngtArgs.args = args;
    }
    this.injected = false;
    this.injectedAttachFn = attachFn;
    this.createView();
  }

  get attachFn(): NgtAttachFunction | null {
    if (!this.injected && this.injectedAttachFn) {
      this.injected = true;
      return this.injectedAttachFn;
    }
    return null;
  }

  validate() {
    return !this.injected && !!this.injectedAttachFn;
  }

  private createView() {
    if (this.view && !this.view.destroyed) {
      this.view.destroy();
    }
    this.view = this.vcr.createEmbeddedView(this.templateRef);
    this.view.detectChanges();
  }
}

export function createAttachFn<TChild, TParent extends object>(
  callback: (params: {
    parent: TParent;
    child: TChild;
    store: RxState<NgtState>;
  }) => ReturnType<NgtAttachFunction<TChild, TParent>>
) {
  return ((parent: TParent, child: TChild, store: RxState<NgtState>) => {
    return callback({ parent, child, store });
  }) as NgtAttachFunction<TChild, TParent>;
}
