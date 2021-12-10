import { Directive } from '@angular/core';
import { createSideEffectObservable, RxState } from '@rx-angular/state';
import { catchError, EMPTY, map, noop, Observable, Subject, tap } from 'rxjs';

@Directive()
export abstract class EnhancedRxState<
  T extends object = {}
> extends RxState<T> {
  private effect$ = createSideEffectObservable();
  private effectSubscription = this.effect$.subscribe();

  ngOnDestroy() {
    super.ngOnDestroy();
    this.effectSubscription.unsubscribe();
  }

  holdEffect<S>(
    obsOrObsWithSideEffect: Observable<S>,
    sideEffectFn: (
      value: S,
      firstRun: boolean
    ) =>
      | ((previousValue: S | undefined, isUnsubscribed: boolean) => void)
      | void
  ): void {
    let cleanupFn: (
      previousValue: S | undefined,
      isUnsubscribed: boolean
    ) => void = noop;
    let firstRun = false;
    let latestValue: S | undefined = undefined;

    const sideEffect = obsOrObsWithSideEffect.pipe(catchError((_) => EMPTY));

    this.effect$.nextEffectObservable(
      sideEffect.pipe(
        tap({
          next: (value: S) => {
            if (cleanupFn && firstRun) {
              cleanupFn(latestValue, false);
            }

            const cleanUpOrVoid = sideEffectFn(value, firstRun);
            if (cleanUpOrVoid) {
              cleanupFn = cleanUpOrVoid;
            }

            latestValue = value;

            if (!firstRun) {
              firstRun = true;
            }
          },
          unsubscribe: () => {
            if (cleanupFn) {
              cleanupFn(latestValue, true);
            }
          },
        })
      )
    );
  }
}

export function capitalize<T extends string>(str: T): Capitalize<T> {
  return (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<T>;
}

type InstanceOrType<T> = T extends abstract new (...args: unknown[]) => infer R
  ? R
  : T;

type UiInteractions<T extends { [x: string]: any }> = {
  [K in keyof T]: (arg: InstanceOrType<T[K]>) => void;
} & {
  [K in Extract<keyof T, string> as `${K}$`]: Observable<T[K]>;
};

export function getActions<T extends object>(): UiInteractions<T> {
  const subject = new Subject<Partial<T>>();

  const handler: ProxyHandler<UiInteractions<T>> = {
    get(target, property) {
      const propName = property.toString().slice(0, -1);

      if (property.toString().split('').pop() === '$') {
        return subject.pipe(map((t) => t[propName as keyof T]));
      }

      return (args: T[keyof T]) => {
        subject.next({ [property]: args } as Partial<T>);
      };
    },
    set(target, property, vale) {
      throw new Error('No setters available. To emit call the property name.');
    },
  };

  return new Proxy({} as UiInteractions<T>, handler);
}
