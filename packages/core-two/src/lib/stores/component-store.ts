import { Injectable, OnDestroy } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { filter, MonoTypeOperatorFunction, Observable, take, tap } from 'rxjs';
import { NgtAnyRecord } from '../types';

/**
 * a default Selector that consumers can quickly use for their selectors projector
 */
export const defaultProjector = () => ({});

/**
 * A custom operator that skips the first undefined value but allows subsequent undefined values.
 * NgRxComponentStore#select always emits the first value regardless of undefined or not after initialize
 */
export const skipFirstUndefined = <T>(skipNull = false): MonoTypeOperatorFunction<T> =>
  filter<T>((value, index) => index > 0 || (skipNull ? value != undefined : value !== undefined));

export const filterFalsy = <T>(): MonoTypeOperatorFunction<T> =>
  filter<T>((value): value is T => !!value);

type EffectFn<TValue> = (
  value: TValue
) =>
  | void
  | undefined
  | ((cleanUpParams: { prev: TValue | undefined; complete: boolean; error: boolean }) => void);

/**
 * An extended `tap` operator that accepts an `effectFn` which:
 * - runs on every `next` notification from `source$`
 * - can optionally return a `cleanUp` function that
 * invokes from the 2nd `next` notification onward and on `unsubscribe` (destroyed)
 *
 *
 * @example
 * ```typescript
 * source$.pipe(
 *  tapEffect((sourceValue) = {
 *    const cb = () => {
 *      doStuff(sourceValue);
 *    };
 *    addListener('event', cb);
 *
 *    return () => {
 *      removeListener('event', cb);
 *    }
 *  })
 * )
 * ```
 */
export function tapEffect<TValue>(effectFn: EffectFn<TValue>): MonoTypeOperatorFunction<TValue> {
  let cleanupFn: (cleanUpParams: {
    prev: TValue | undefined;
    complete: boolean;
    error: boolean;
  }) => void = () => {};
  let firstRun = false;
  let prev: TValue | undefined = undefined;

  const teardown = (error: boolean) => {
    return () => {
      if (cleanupFn) {
        cleanupFn({ prev, complete: true, error });
      }
    };
  };

  return tap<TValue>({
    next: (value: TValue) => {
      if (cleanupFn && firstRun) {
        cleanupFn({ prev, complete: false, error: false });
      }

      const cleanUpOrVoid = effectFn(value);
      if (cleanUpOrVoid) {
        cleanupFn = cleanUpOrVoid;
      }

      prev = value;

      if (!firstRun) {
        firstRun = true;
      }
    },
    complete: teardown(false),
    unsubscribe: teardown(false),
    error: teardown(true),
  });
}

@Injectable()
export class NgtComponentStore<
    TState extends object = any,
    TInternalState extends object = TState & NgtAnyRecord
  >
  extends ComponentStore<TInternalState>
  implements OnDestroy
{
  constructor() {
    super({} as TInternalState);
    this.initialize();
  }

  // exposing get (as gett) since THREE is imperative.
  // we need to imperatively get state sometimes for usages in animation loop
  // we also bind "this" instance so we don't have to bind it later
  override get(): TInternalState;
  override get<R>(projector: (s: TInternalState) => R): R;
  override get<R>(projector?: (s: TInternalState) => R): R | TInternalState {
    if (!this['isInitialized']) {
      this.set({});
    }
    let value: R | TInternalState;

    this['stateSubject$'].pipe(take(1)).subscribe((state: TInternalState) => {
      value = projector ? projector(state) : state;
    });

    return value!;
  }

  readonly set = this.patchState.bind(this);

  /**
   * A utility class method to select a state on the template as Observable
   */
  selectKey<TKey extends keyof TInternalState & string>(
    key: TKey,
    skipFirst = false
  ): Observable<TInternalState[TKey]> {
    return this.select((s) => s[key]).pipe(skipFirst ? skipFirstUndefined() : (s) => s);
  }

  /**
   * A utility class method to get a state on the template as imperative value
   */
  getKey<TKey extends keyof TInternalState & string>(key: TKey): TInternalState[TKey] {
    return this.get((s) => s[key]);
  }

  protected initialize() {
    return;
  }

  override ngOnDestroy(): void {
    if (this['stateSubject$']) {
      this['stateSubject$'].complete();
    }

    if (this['destroySubject$']) {
      this['destroySubject$'].complete();
    }
  }
}
