import { ElementRef } from '@angular/core';
import {
  BehaviorSubject,
  distinctUntilChanged,
  map,
  Observable,
  pairwise,
  Subscription,
  takeUntil,
} from 'rxjs';
import { filterFalsy } from '../stores/component-store';
import { injectNgtDestroy } from './destroy';

type Subscribe<T> = (callback: (current: T, previous: T | null) => void) => Subscription;

export function injectRef<T>(
  initialValue: ElementRef<T> | (T | null) = null
): ElementRef<T> & { subscribe: Subscribe<T>; $: Observable<T> } {
  let ref = new ElementRef<T>(initialValue as T);
  if (initialValue instanceof ElementRef) {
    ref = initialValue;
  }

  const ref$ = new BehaviorSubject<T>(ref.nativeElement);
  const [destroy$, cdr] = injectNgtDestroy(() => {
    ref$.complete();
  });
  const obs$ = ref$.asObservable().pipe(distinctUntilChanged(), pairwise(), takeUntil(destroy$));

  const subscribe: Subscribe<T> = (callback) => {
    return obs$.subscribe(([previous, current]) => callback(current, previous));
  };
  const $ = obs$.pipe(
    map(([, curr]) => curr),
    filterFalsy(),
    takeUntil(destroy$)
  );

  return new Proxy(ref, {
    get(target, p, receiver) {
      if (p === 'subscribe') return subscribe;
      if (p === '$') return $;
      return Reflect.get(target, p, receiver);
    },
    set(target, p, newValue, receiver) {
      if (p === 'nativeElement' && target[p] !== newValue) {
        ref$.next(newValue);
        cdr.detectChanges();
        return Reflect.set(target, p, newValue, receiver);
      }
      return Reflect.set(target, p, newValue, receiver);
    },
  }) as ElementRef<T> & { subscribe: Subscribe<T>; $: Observable<T> };
}
