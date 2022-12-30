import { ElementRef } from '@angular/core';
import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  Observable,
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

  let lastValue = ref.nativeElement;
  const ref$ = new BehaviorSubject<T>(lastValue);
  const [destroy$, cdr] = injectNgtDestroy(() => {
    ref$.complete();
  });

  const obs$ = ref$.asObservable().pipe(distinctUntilChanged(), takeUntil(destroy$));

  const subscribe: Subscribe<T> = (callback) => {
    return obs$.subscribe((current) => {
      callback(current, lastValue);
      lastValue = current;
    });
  };

  const $ = obs$.pipe(
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
        try {
          cdr.detectChanges();
        } catch (e) {
          cdr.markForCheck();
        }
        lastValue = target[p];
        return Reflect.set(target, p, newValue, receiver);
      }
      return Reflect.set(target, p, newValue, receiver);
    },
  }) as NgtInjectedRef<T>;
}
