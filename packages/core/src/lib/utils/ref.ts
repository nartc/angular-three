import { ElementRef } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, pairwise, Subscription, takeUntil } from 'rxjs';
import { injectNgtDestroy } from './destroy';

type Subscribe<T> = (callback: (current: T, previous: T | null) => void) => Subscription;

export function injectRef<T>(
  initialValue: ElementRef<T> | (T | null) = null
): ElementRef<T> & { subscribe: Subscribe<T> } {
  let ref = new ElementRef<T>(initialValue as T);
  if (initialValue instanceof ElementRef) {
    ref = initialValue;
  }

  const ref$ = new BehaviorSubject<T>(ref.nativeElement);
  const destroy$ = injectNgtDestroy(() => {
    ref$.complete();
  });
  const obs$ = ref$.asObservable().pipe(distinctUntilChanged(), pairwise(), takeUntil(destroy$));

  const subscribe: Subscribe<T> = (callback) => {
    return obs$.subscribe(([previous, current]) => callback(current, previous));
  };

  return new Proxy(ref, {
    get(target, p, receiver) {
      if (p === 'subscribe') return subscribe;
      return Reflect.get(target, p, receiver);
    },
    set(target, p, newValue, receiver) {
      const setResult = Reflect.set(target, p, newValue, receiver);
      if (p === 'nativeElement' && target[p] !== newValue) {
        ref$.next(newValue);
      }
      return setResult;
    },
  }) as ElementRef<T> & { subscribe: Subscribe<T> };
}
