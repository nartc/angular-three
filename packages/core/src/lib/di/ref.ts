import { ElementRef } from '@angular/core';
import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  map,
  merge,
  Observable,
  of,
  Subscription,
  switchMap,
  takeUntil,
} from 'rxjs';
import { NgtAnyRecord, NgtInstanceNode } from '../types';
import { getLocalState } from '../utils/instance';
import { is } from '../utils/is';
import { injectNgtDestroy } from './destroy';

type Subscribe<T> = (callbacK: (current: T, previous: T | null) => void) => Subscription;

export type NgtInjectedRef<T> = ElementRef<T> & {
  subscribe: Subscribe<T>;
  $: Observable<T>;
  children$: (childType?: 'objects' | 'nonObjects' | 'both') => Observable<NgtInstanceNode[]>;
};

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

  const children$ = (childType: 'objects' | 'nonObjects' | 'both' = 'objects') =>
    $.pipe(
      switchMap((instance) => {
        const localState = getLocalState(instance as object);
        if (localState) {
          return merge(localState.objects, localState.nonObjects).pipe(
            map(() =>
              childType === 'both'
                ? [...localState.objects.value, ...localState.nonObjects.value]
                : localState[childType].value
            )
          );
        }
        return of([]);
      }),
      filter((children) => children.length > 0),
      takeUntil(destroy$)
    );

  Object.defineProperty(ref, 'nativeElement', {
    set: (newVal: T) => {
      if (ref.nativeElement !== newVal) {
        ref$.next(newVal);
        try {
          if ((cdr as NgtAnyRecord)['context']) {
            cdr.detectChanges();
          }
        } catch (e) {
          cdr.markForCheck();
        }
        lastValue = ref.nativeElement;
        ref.nativeElement = newVal;
      }
    },
    get: () => ref$.value,
  });

  return Object.assign(ref, {
    get subscribe() {
      return subscribe;
    },
    get $() {
      return $;
    },
    get children$() {
      return children$;
    },
  });
}
