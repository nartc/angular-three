import { Directive } from '@angular/core';
import { createSideEffectObservable, RxState } from '@rx-angular/state';
import { catchError, EMPTY, noop, Observable, Subject, tap } from 'rxjs';

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

export type ActionAccess<T extends { [x: string]: any }> = {
  [K in keyof T]: (arg: InstanceOrType<T[K]>) => void;
} & {
  [K in Extract<keyof T, string> as `${K}$`]: Observable<T[K]>;
};

/**
 * Returns a object based off of the provided typing with a separate setter `[prop](value: T[K]): void` and observable stream `[prop]$: Observable<T[K]>`;
 *
 * { search: string } => { search$: Observable<string>, search: (value: string) => void;}
 *
 * @example
 *
 * const actions = getActions<search: string, submit: void>({search: (e) => e.target.value});
 *
 * actions.search($event);
 * actions.search$ | async;
 *
 * @param transforms map of transform functions to apply on certain properties if they are set.
 */
export function getActions<T extends object>(): ActionAccess<T> {
  const subjects: Record<string, Subject<T[keyof T]>> = {};

  const handler: ProxyHandler<ActionAccess<T>> = {
    get(_, property: string) {
      if (property.toString().split('').pop() === '$') {
        const propName: string | number | Symbol = property
          .toString()
          .slice(0, -1);
        subjects[propName] = subjects[propName] || new Subject<keyof T>();
        return subjects[propName];
      }

      return (args: T[keyof T]) => {
        subjects[property] = subjects[property] || new Subject<keyof T>();
        subjects[property].next(args);
      };
    },
    set() {
      throw new Error('No setters available. To emit call the property name.');
    },
  };

  return new Proxy({} as ActionAccess<T>, handler);
}
