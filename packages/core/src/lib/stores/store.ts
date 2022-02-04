import { Directive } from '@angular/core';
import { createSideEffectObservable, RxState } from '@rx-angular/state';
import { catchError, EMPTY, noop, Observable, OperatorFunction, startWith, Subject, tap } from 'rxjs';

type AsyncActions<TActions extends object> = {
  [TActionKey in keyof TActions]: (args: TActions[TActionKey]) => void;
};

type AsyncActionsObservables<TActions extends object> = {
  [TActionKey in Extract<keyof TActions,
    string> as `${TActionKey}$`]: Observable<TActions[TActionKey]>;
};

type AsyncActionsProxy<TActions extends object> = AsyncActions<TActions> &
  AsyncActionsObservables<TActions>;

@Directive()
export class NgtStore<TState extends object = {}> extends RxState<TState> {
  private readonly subCache: Record<string, Subject<any>> = {};
  private readonly effect$ = createSideEffectObservable();
  private readonly effectSubscription = this.effect$.subscribe();

  /**
   * Basically useEffect
   */
  effect<TValue>(
    obsOrObsWithSideEffect: Observable<TValue>,
    sideEffectFn: (
      value: TValue
    ) =>
      | ((previousValue: TValue | undefined, isUnsubscribed: boolean) => void)
      | void
  ): void {
    let cleanupFn: (
      previousValue: TValue | undefined,
      isUnsubscribed: boolean
    ) => void = noop;
    let firstRun = false;
    let latestValue: TValue | undefined = undefined;

    const sideEffect = obsOrObsWithSideEffect.pipe(catchError((_) => EMPTY));

    this.effect$.nextEffectObservable(
      sideEffect.pipe(
        tap({
          next: (value: TValue) => {
            if (cleanupFn && firstRun) {
              cleanupFn(latestValue, false);
            }

            const cleanUpOrVoid = sideEffectFn(value);
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
          }
        })
      )
    );
  }

  /**
   * Create an AsyncActionsProxy that contains executable actions
   * along with their respective Observables.
   */
  createActions<TActions extends object>(): AsyncActionsProxy<TActions> {
    return new Proxy(
      {},
      {
        get: (_, p: string) => {
          if (p.endsWith('$')) {
            return (
              this.subCache[p] || (this.subCache[p] = new Subject())
            ).asObservable();
          }

          return (args: TActions[keyof TActions]) => {
            const $prop = p + '$';
            const sub =
              this.subCache[$prop] || (this.subCache[$prop] = new Subject());
            sub.next(args);
          };
        },
        set: () => {
          throw new Error('setters are not available on asyncActions');
        }
      } as ProxyHandler<TActions>
    ) as AsyncActionsProxy<TActions>;
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.effectSubscription.unsubscribe();
    for (const subKey in this.subCache) {
      this.subCache[subKey].complete();
    }
  }
}

export function startWithUndefined<TValue>(): OperatorFunction<TValue, TValue> {
  return startWith<TValue>(undefined) as OperatorFunction<TValue, TValue>;
}
