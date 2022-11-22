import { DOCUMENT } from '@angular/common';
import { Directive, Inject, Optional, Self } from '@angular/core';
import { map, merge, takeUntil } from 'rxjs';
import { NgtInstance } from '../instance';

@Directive({
    selector: '[ngtCursor]',
    standalone: true,
    exportAs: 'ngtCursor',
})
export class NgtCursor {
    constructor(
        @Optional()
        @Self()
        instance: NgtInstance,
        @Inject(DOCUMENT) document: Document
    ) {
        if (!instance) return;
        merge(instance.pointerover.pipe(map(() => true)), instance.pointerout.pipe(map(() => false)))
            .pipe(takeUntil(instance.destroy$))
            .subscribe((hovered) => {
                document.body.style.cursor = hovered ? 'pointer' : 'auto';
            });
    }
}
