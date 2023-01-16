import { Directive, EmbeddedViewRef, inject, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive()
export abstract class NgtHasValidateForRenderer {
  protected readonly vcr = inject(ViewContainerRef);
  protected readonly templateRef = inject(TemplateRef);

  protected view?: EmbeddedViewRef<unknown>;
  protected injected = false;

  abstract validate(): boolean;

  constructor() {
    const commentNode = this.vcr.element.nativeElement;
    if (commentNode['__ngt_add_comment__']) {
      commentNode['__ngt_add_comment__']();
      delete commentNode['__ngt_add_comment__'];
    }
  }

  protected createView() {
    if (this.view && !this.view.destroyed) {
      this.view.destroy();
    }
    this.view = this.vcr.createEmbeddedView(this.templateRef);
    this.view.detectChanges();
  }
}
