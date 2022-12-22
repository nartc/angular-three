import { ChangeDetectorRef, inject, ViewRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export function injectNgtDestroy(
  destroyCallback?: () => void
): [Observable<void>, ChangeDetectorRef] {
  try {
    const cdr = inject(ChangeDetectorRef) as ViewRef;
    const destroy$ = new Subject<void>();

    queueMicrotask(() => {
      cdr.onDestroy(() => {
        destroy$.next();
        destroy$.complete();
        destroyCallback?.();
      });
    });

    return [destroy$.asObservable(), cdr];
  } catch (e) {
    console.warn(
      `[NGT] injectNgtDestroy must be used in a Component/Directive constructor context`
    );
    return [] as unknown as [Observable<void>, ChangeDetectorRef];
  }
}
