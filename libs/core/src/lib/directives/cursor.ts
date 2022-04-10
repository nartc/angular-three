import { DOCUMENT } from '@angular/common';
import { Directive, Inject, NgModule, Optional, Self } from '@angular/core';
import { map, merge, takeUntil } from 'rxjs';
import { NgtObject } from '../abstracts/object';
import { NgtDestroyed } from '../services/destroyed';

@Directive({
    selector: '[ngtCursor]',
    exportAs: 'ngtCursor',
    providers: [NgtDestroyed],
})
export class NgtCursor {
    constructor(
        @Optional()
        @Self()
        object: NgtObject,
        @Inject(DOCUMENT) document: Document,
        destroyed: NgtDestroyed
    ) {
        if (!object) return;
        merge(
            object.pointerover.pipe(map(() => true)),
            object.pointerout.pipe(map(() => false))
        )
            .pipe(takeUntil(destroyed))
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
