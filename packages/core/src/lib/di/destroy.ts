import { ChangeDetectorRef, inject, ViewRef } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

export function injectNgtDestroy(destroyCallback?: () => void): [Observable<void>, ChangeDetectorRef] {
    try {
        const cdr = inject(ChangeDetectorRef) as ViewRef;
        const destroy$ = new ReplaySubject<void>();

        queueMicrotask(() => {
            cdr.onDestroy(() => {
                destroy$.next();
                destroy$.complete();
                destroyCallback?.();
            });
        });

        return [destroy$.asObservable(), cdr];
    } catch (e) {
        throw new Error(`[NGT] injectNgtDestroy must be used in a Component/Directive constructor context`);
    }
}
