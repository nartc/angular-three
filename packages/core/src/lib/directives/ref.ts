import {
  Directive,
  ElementRef,
  EmbeddedViewRef,
  inject,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { injectNgtStore } from '../store';
import { NgtHasValidateForRenderer } from '../types';

@Directive({
  selector: '[ref]',
  standalone: true,
})
export class NgtRef<T> implements NgtHasValidateForRenderer {
  readonly store = injectNgtStore({ skipSelf: true }).store;
  private readonly templateRef = inject(TemplateRef);
  private readonly vcr = inject(ViewContainerRef);
  private view?: EmbeddedViewRef<unknown>;

  private injectedRef?: ElementRef<T>;
  private injected = false;
  shouldCreateView = true;

  @Input() set ref(ref: ElementRef<T> | null) {
    if (!ref) return;
    this.injected = false;
    this.injectedRef = ref;
    if (this.shouldCreateView) {
      this.createView();
    }
  }

  get ref(): ElementRef<T> | null {
    if (!this.injected && this.injectedRef) {
      this.injected = true;
      return this.injectedRef;
    }
    return null;
  }

  validate() {
    return !this.injected && !!this.injectedRef && !this.injectedRef.nativeElement;
  }

  private createView() {
    if (this.view && !this.view.destroyed) {
      this.view.destroy();
    }
    this.view = this.vcr.createEmbeddedView(this.templateRef);
    this.view.detectChanges();
  }
}
