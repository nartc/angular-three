import { ElementRef } from '@angular/core';
import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  pairwise,
  Subscription,
  takeUntil,
} from 'rxjs';
import { is } from '../utils/is';
import { injectNgtDestroy } from './destroy';

type Subscribe<T> = (callbacK: (current: T, previous: T | null) => void) => Subscription;

export type NgtInjectedRef<T> = ElementRef<T> & { subscribe: Subscribe<T>; $: Observable<T> };

export function injectNgtRef<T>(
  initialValue: ElementRef<T> | (T | null) = null
): NgtInjectedRef<T> {
  let ref = new ElementRef<T>(initialValue as T);
  if (is.ref(initialValue)) {
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
    filter((s) => !!s),
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
  }) as NgtInjectedRef<T>;
}
