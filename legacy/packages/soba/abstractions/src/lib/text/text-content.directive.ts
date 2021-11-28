import { Directive, ElementRef, NgZone, OnInit } from '@angular/core';

@Directive({
  selector: 'ngt-soba-text-content',
  exportAs: 'ngtSobaTextContent',
})
export class NgtSobaTextContent implements OnInit {
  private _text = '';

  constructor(
    private ngZone: NgZone,
    private el: ElementRef<HTMLUnknownElement>
  ) {}

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.el.nativeElement.childNodes.forEach((childNode) => {
        if (childNode instanceof Text) {
          this._text += childNode.wholeText;
        }
      });
    });
  }

  get text() {
    return this._text.trim();
  }
}
