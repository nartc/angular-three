import { DOCUMENT } from '@angular/common';
import { Directive, Inject, NgModule, Optional, Self } from '@angular/core';
import { map, merge, takeUntil } from 'rxjs';
import { NgtObject } from '../abstracts/object';

@Directive({
  selector: '[ngtCursor]',
  exportAs: 'ngtCursor',
})
export class NgtCursor {
  constructor(
    @Optional()
    @Self()
    object: NgtObject,
    @Inject(DOCUMENT) document: Document
  ) {
    if (!object) return;
    merge(object.pointerover.pipe(map(() => true)), object.pointerout.pipe(map(() => false)))
      .pipe(takeUntil(object.destroy$))
      .subscribe((hovered) => {
        document.body.style.cursor = hovered ? 'pointer' : 'auto';
      });
  }
}

@NgModule({
  declarations: [NgtCursor],
  exports: [NgtCursor],
})
export class NgtCursorModule {}
