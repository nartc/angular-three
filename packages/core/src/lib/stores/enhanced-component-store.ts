import { Directive } from '@angular/core';
import { createSideEffectObservable, RxState } from '@rx-angular/state';
import { catchError, EMPTY, noop, Observable, tap } from 'rxjs';

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
