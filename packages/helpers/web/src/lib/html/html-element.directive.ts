import { Directive, ElementRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[ngtHtmlElement]',
  exportAs: 'ngtHtmlElement',
})
export class HtmlElementDirective {
  constructor(
    public readonly viewContainerRef: ViewContainerRef,
    public readonly elRef: ElementRef<HTMLElement>
  ) {}
}
