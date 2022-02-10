import { Injectable, OnDestroy } from '@angular/core';
import {
  asapScheduler,
  combineLatest,
  concatMap,
  distinctUntilChanged,
  filter,
  isObservable,
  map,
  MonoTypeOperatorFunction,
  noop,
  Observable,
  of,
  queueScheduler,
  ReplaySubject,
  scheduled,
  share,
  startWith,
  Subject,
  Subscription,
  take,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs';

export type SelectorResults<TSelectors extends Observable<unknown>[]> = {
  [Key in keyof TSelectors]: TSelectors[Key] extends Observable<infer TResult>
    ? TResult
    : never;
};

export type Projector<Selectors extends Observable<unknown>[], TResult> = (
  ...args: SelectorResults<Selectors>
) => TResult;

@Injectable()
export class NgtStore<TState extends object = {}> implements OnDestroy {
  // Should be used only in ngOnDestroy.
  private readonly destroySubject$ = new ReplaySubject<void>(1);
  // Exposed to any extending Store to be used for the teardown.
  readonly destroy$ = this.destroySubject$.asObservable();

  private readonly stateSubject$ = new ReplaySubject<TState>(1);

  /** Completes all relevant Observable streams. */
  ngOnDestroy() {
    this.stateSubject$.complete();
    this.destroySubject$.next();
  }

  get(): TState;
  get<TResult>(projector: (s: TState) => TResult): TResult;
  get<TResult>(projector?: (s: TState) => TResult): TResult | TState {
    let value: TResult | TState;

    this.stateSubject$
      .pipe(
        take(1),
        skipUndefined(),
        map((state) => (projector ? projector(state) : state)),
        skipUndefined()
      )
      .subscribe((result) => {
        value = result;
      });

    return value!;
  }

  /**
   * Patches the state with provided partial state.
   *
   * @param partialStateOrUpdaterFn a partial state or a partial updater
   * function that accepts the state and returns the partial state.
   */
  set(
    partialStateOrUpdaterFn:
      | Partial<TState>
      | Observable<Partial<TState>>
      | ((state: TState) => Partial<TState> | Observable<Partial<TState>>)
  ): void {
    const patchedState =
      typeof partialStateOrUpdaterFn === 'function'
        ? partialStateOrUpdaterFn(this.get())
        : partialStateOrUpdaterFn;

    this.update((state, partialState: Partial<TState>) => ({
      ...state,
      ...partialState,
    }))(patchedState);
  }

  /**
   * Creates a selector.
   *
   * @param projector A pure projection function that takes the current state and
   *   returns some new slice/projection of that state.
   * @return An observable of the projector results.
   */
  select<TResult>(projector: (s: TState) => TResult): Observable<TResult>;
  select<TSelectors extends Observable<unknown>[], TResult>(
    ...args: [
      ...selectors: TSelectors,
      projector: Projector<TSelectors, TResult>
    ]
  ): Observable<TResult>;
  select<
    TSelectors extends Array<Observable<unknown> | TProjectorFn>,
    TResult,
    TProjectorFn = (...a: unknown[]) => TResult
  >(...args: TSelectors): Observable<TResult> {
    const { observables, projector } = processSelectorArgs<
      TSelectors,
      TResult,
      TProjectorFn
    >(args);

    let observable$: Observable<TResult>;
    // If there are no Observables to combine, then we'll just map the value.
    if (observables.length === 0) {
      observable$ = this.stateSubject$.pipe(
        skipUndefined(),
        map(projector as unknown as (value: TState, index: number) => TResult)
      );
    } else {
      // If there are multiple arguments, then we're aggregating selectors, so we need
      // to take the combineLatest of them before calling the map function.
      observable$ = combineLatest(observables).pipe(
        map((projectorArgs) =>
          (projector as unknown as (...a: unknown[]) => TResult)(
            ...projectorArgs
          )
        )
      );
    }

    return observable$.pipe(
      skipUndefined(),
      distinctUntilChanged(),
      share({
        connector: () => new ReplaySubject(1),
        resetOnComplete: true,
        resetOnRefCountZero: true,
        resetOnError: true,
      }),
      takeUntil(this.destroy$)
    );
  }

  /**
   * Creates an effect.
   *
   * This effect is subscribed to throughout the lifecycle of the ComponentStore.
   * @param generator A function that takes an origin Observable input and
   *     returns an Observable. The Observable that is returned will be
   *     subscribed to for the life of the component.
   * @return A function that, when called, will trigger the origin Observable.
   */
  effect<
    // This type quickly became part of effect 'API'
    TProvidedType = void,
    // The actual origin$ type, which could be unknown, when not specified
    TOriginType extends
      | Observable<TProvidedType>
      | unknown = Observable<TProvidedType>,
    // Unwrapped actual type of the origin$ Observable, after default was applied
    TObservableType = TOriginType extends Observable<infer A> ? A : never,
    // Return either an empty callback or a function requiring specific types as inputs
    TReturnType = TProvidedType | TObservableType extends void
      ? () => void
      : (
          observableOrValue: TObservableType | Observable<TObservableType>
        ) => Subscription
  >(generator: (origin$: TOriginType) => Observable<unknown>): TReturnType {
    const origin$ = new Subject<TObservableType>();
    generator(origin$ as TOriginType)
      // tied to the lifecycle 👇 of ComponentStore
      .pipe(takeUntil(this.destroy$))
      .subscribe();

    return ((
      observableOrValue?: TObservableType | Observable<TObservableType>
    ): Subscription => {
      const observable$ = isObservable(observableOrValue)
        ? observableOrValue
        : of(observableOrValue);
      return observable$.pipe(takeUntil(this.destroy$)).subscribe((value) => {
        // any new 👇 value is pushed into a stream
        origin$.next(value as TObservableType);
      });
    }) as unknown as TReturnType;
  }

  private update<
    // Allow to force-provide the type
    TProvidedType = void,
    // This type is derived from the `value` property, defaulting to void if it's missing
    TOriginType = TProvidedType,
    // The Value type is assigned from the Origin
    TValueType = TOriginType,
    // Return either an empty callback or a function requiring specific types as inputs
    TReturnType = TOriginType extends void
      ? () => void
      : (observableOrValue: TValueType | Observable<TValueType>) => Subscription
  >(updaterFn: (state: TState, value: TOriginType) => TState): TReturnType {
    return ((
      observableOrValue?: TOriginType | Observable<TOriginType>
    ): Subscription => {
      const observable$ = isObservable(observableOrValue)
        ? observableOrValue
        : of(observableOrValue);

      return observable$
        .pipe(
          concatMap((value) =>
            scheduled([value], queueScheduler).pipe(
              withLatestFrom(this.stateSubject$.pipe(startWith({})))
            )
          ),
          takeUntil(this.destroy$)
        )
        .subscribe({
          next: ([value, currentState]) => {
            this.stateSubject$.next(
              updaterFn((currentState || {}) as TState, value!)
            );
          },
          error: (error: Error) => {
            this.stateSubject$.error(error);
          },
        });
    }) as unknown as TReturnType;
  }
}

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
export function tapEffect<TValue>(
  effectFn: (
    value: TValue
  ) =>
    | ((cleanUpParams: {
        prev: TValue | undefined;
        complete: boolean;
        error: boolean;
      }) => void)
    | void
): MonoTypeOperatorFunction<TValue> {
  let cleanupFn: (cleanUpParams: {
    prev: TValue | undefined;
    complete: boolean;
    error: boolean;
  }) => void = noop;
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

export function debounceSync<T>(): MonoTypeOperatorFunction<T> {
  return (source) =>
    new Observable<T>((observer) => {
      let actionSubscription: Subscription | undefined;
      let actionValue: T | undefined;
      const rootSubscription = new Subscription();
      rootSubscription.add(
        source.subscribe({
          complete: () => {
            if (actionSubscription) {
              observer.next(actionValue);
            }
            observer.complete();
          },
          error: (error) => {
            observer.error(error);
          },
          next: (value) => {
            actionValue = value;
            if (!actionSubscription) {
              actionSubscription = asapScheduler.schedule(() => {
                observer.next(actionValue);
                actionSubscription = undefined;
              });
              rootSubscription.add(actionSubscription);
            }
          },
        })
      );
      return rootSubscription;
    });
}

export function skipUndefined<TValue>(): MonoTypeOperatorFunction<TValue> {
  return filter<TValue>((value) => value !== undefined);
}

function processSelectorArgs<
  TSelectors extends Array<Observable<unknown> | TProjectorFn>,
  TResult,
  TProjectorFn = (...a: unknown[]) => TResult
>(
  args: TSelectors
): {
  observables: Observable<unknown>[];
  projector: TProjectorFn;
} {
  const selectorArgs = Array.from(args);
  // Last argument is either projector or config
  const projector = selectorArgs.pop() as TProjectorFn;

  // The Observables to combine, if there are any.
  const observables = selectorArgs as Observable<unknown>[];
  return {
    observables,
    projector,
  };
}
