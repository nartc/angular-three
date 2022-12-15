import { ChangeDetectorRef, ElementRef, inject, ViewRef } from '@angular/core';
import create, { StoreApi } from 'zustand/vanilla';
import { is } from './is';

export function ref<T>(initialValue: ElementRef<T> | (T | null) = null): ElementRef<T> & {
  subscribe: (
    callback: (current: T, previous: T | null) => void
  ) => ReturnType<StoreApi<ElementRef<T>>['subscribe']>;
  destroy: StoreApi<ElementRef<T>>['destroy'];
} {
  const store = create<ElementRef<T>>(() =>
    initialValue && is.ref(initialValue) ? initialValue : new ElementRef(initialValue!)
  );

  try {
    const viewRef = inject(ChangeDetectorRef) as ViewRef;
    queueMicrotask(() => {
      viewRef.onDestroy(() => {
        store.destroy();
      });
    });
  } catch (e) {
    // this errors out because we run ref() outside of constructor context of Angular
    console.log('error');
  }

  return {
    set nativeElement(val: T) {
      store.setState({ nativeElement: val });
    },
    get nativeElement() {
      return store.getState().nativeElement;
    },
    subscribe: (callback: (current: T, previous: T | null) => void) => {
      return store.subscribe((_current, _previous) => {
        callback(_current.nativeElement, _previous.nativeElement);
      });
    },
    destroy: store.destroy.bind(store),
  };
}

// export function injectRef<T>(
//   initialValue: T | null = null
// ): ElementRef<T> & { subscribe: Subscribe<T> } {
//   const viewRef = inject(ChangeDetectorRef) as ViewRef;
//   const destroy$ = new Subject<void>();

//   const subject = new BehaviorSubject<T>(initialValue!);
//   const obs$ = subject.asObservable().pipe(distinctUntilChanged(), pairwise(), takeUntil(destroy$));

//   queueMicrotask(() => {
//     viewRef.onDestroy(() => {
//       destroy$.next();
//       destroy$.complete();
//       subject.complete();
//     });
//   });

//   const subscribe: Subscribe<T> = (callback) =>
//     obs$.subscribe(([previousValue, val]) => callback(val, previousValue));

//   const proxiedRef = new Proxy(new ElementRef<T>(initialValue!), {
//     get(target, p, receiver) {
//       if (p === 'subscribe') return subscribe;
//       return Reflect.get(target, p, receiver);
//     },
//     set(target, p, newValue, receiver) {
//       if (p === 'nativeElement' && target[p] !== newValue) {
//         subject.next(newValue);
//       }
//       return Reflect.set(target, p, newValue, receiver);
//     },
//   });

//   return proxiedRef as ElementRef<T> & { subscribe: Subscribe<T> };
// }
