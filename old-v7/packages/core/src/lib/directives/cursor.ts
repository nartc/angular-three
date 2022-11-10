import { DOCUMENT } from '@angular/common';
import { Directive, inject } from '@angular/core';
import { map, merge, tap } from 'rxjs';
import { NgtObject } from '../abstracts/object';

@Directive({
  selector: '[ngtCursor]',
  standalone: true,
  exportAs: 'ngtCursor',
})
export class NgtCursor {
  constructor() {
    const object = inject(NgtObject, { optional: true, self: true });
    if (!object) return;

    const document = inject(DOCUMENT);
    object.effect(
      tap((hovered) => {
        document.body.style.cursor = hovered ? 'pointer' : 'auto';
      })
    )(merge(object.pointerover.pipe(map(() => true)), object.pointerout.pipe(map(() => false))));
  }
}
