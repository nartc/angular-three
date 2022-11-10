import type { OnDestroy } from '@angular/core';
import { Directive } from '@angular/core';
import {
  catchError,
  combineLatest,
  distinctUntilChanged,
  EMPTY,
  filter,
  isObservable,
  map,
  MonoTypeOperatorFunction,
  noop,
  Observable,
  observeOn,
  of,
  OperatorFunction,
  queueScheduler,
  ReplaySubject,
  share,
  ShareConfig,
  startWith,
  Subject,
  Subscription,
  take,
  takeUntil,
  tap,
  throwError,
  withLatestFrom,
} from 'rxjs';
import { UnknownRecord } from '../types';
import { debounceSync } from './debounce-sync';

type SelectConfig = {
  debounce?: boolean;
};

export type SelectorResults<TSelectors extends Observable<unknown>[]> = {
  [Key in keyof TSelectors]: TSelectors[Key] extends Observable<infer TResult>
    ? TResult
    : never;
};

export type Projector<Selectors extends Observable<unknown>[], TResult> = (
  ...args: SelectorResults<Selectors>
) => TResult;

@Directive()
export abstract class NgtComponentStore<
  TState extends object = any,
  TInternalState = TState & { [key: string]: any }
> implements OnDestroy
{
  // Should be used only in ngOnDestroy.
  readonly #destroySubject$ = new ReplaySubject<void>(1);
  // Exposed to any extending Store to be used for the teardown.
  readonly destroy$ = this.#destroySubject$.asObservable();

  readonly #stateSubject$ = new ReplaySubject<TInternalState>(1);

  get(): TInternalState;
  get<TResult>(projector: (s: TInternalState) => TResult): TResult;
  get<TResult>(
    projector?: (s: TInternalState) => TResult
  ): TResult | TInternalState {
    let value: TResult | TInternalState;

    this.#stateSubject$
      .pipe(
        take(1),
        map((state) => (projector ? projector(state) : state)),
        skipUndefined()
      )
      .subscribe((result) => {
        value = result;
      });

    return value! as TResult | TInternalState;
  }

  /**
   * Patches the state with provided partial state.
   *
   * @param partialStateOrUpdaterFn a partial state or a partial updater
   * function that accepts the state and returns the partial state.
   */
  set(
    partialStateOrUpdaterFn:
      | Partial<TInternalState>
      | Observable<Partial<TInternalState>>
      | ((
          state: TInternalState
        ) =>
          | Partial<TInternalState>
          | Partial<UnknownRecord>
          | Observable<Partial<TInternalState>>)
      | Partial<UnknownRecord>
  ): void {
    if (this.get() == undefined) {
      this.#stateSubject$.next({} as TInternalState);
    }

    const patchedState =
      typeof partialStateOrUpdaterFn === 'function'
        ? partialStateOrUpdaterFn(this.get())
        : partialStateOrUpdaterFn;

    this.#update((state, partialState: Partial<TInternalState>) => ({
      ...state,
      ...partialState,
    }))(patchedState as Partial<TInternalState>);
  }

  /**
   * Creates a selector.
   *
   * @return An observable of the projector results.
   */
  select(): Observable<TInternalState>;
  select<TResult>(
    projector: (s: TInternalState) => TResult,
    config?: SelectConfig
  ): Observable<TResult>;
  select<TSelectors extends Observable<unknown>[], TResult>(
    ...args: [
      ...selectors: TSelectors,
      projector: Projector<TSelectors, TResult>
    ]
  ): Observable<TResult>;
  select<TSelectors extends Observable<unknown>[]>(
    ...args: [...selectors: TSelectors]
  ): Observable<[]>;
  select<TSelectors extends Observable<unknown>[], TResult>(
    ...args: [
      ...selectors: TSelectors,
      projector: Projector<TSelectors, TResult>,
      config: SelectConfig
    ]
  ): Observable<TResult>;
  select<TSelectors extends Observable<unknown>[]>(
    ...args: [...selectors: TSelectors, config: SelectConfig]
  ): Observable<[]>;
  select<
    TSelectors extends Array<Observable<unknown> | TProjectorFn>,
    TResult,
    TProjectorFn extends (...a: unknown[]) => TResult
  >(
    ...args: TSelectors
  ): Observable<TInternalState> | Observable<TResult> | Observable<[]> {
    const shareConfig: ShareConfig<TInternalState | TResult> = {
      connector: () => new ReplaySubject(1),
      resetOnComplete: true,
      resetOnRefCountZero: true,
      resetOnError: true,
    };

    if (args.length === 0) {
      return this.#stateSubject$.pipe(
        skipUndefined(),
        distinctUntilChanged(),
        share(shareConfig as ShareConfig<TInternalState>),
        takeUntil(this.destroy$)
      ) as Observable<TInternalState>;
    }

    // if last item is an observable, then the project is missing
    if (isObservable(args[args.length - 1])) {
      args.push((() => []) as TProjectorFn);
    }

    const { observables, projector, config } = processSelectorArgs<
      TSelectors,
      TResult,
      TProjectorFn
    >(args);

    let observable$: Observable<TResult>;
    // If there are no Observables to combine, then we'll just map the value.
    if (observables.length === 0) {
      observable$ = this.#stateSubject$.pipe(
        config.debounce ? debounceSync() : (source$) => source$,
        map((state) => projector(state))
      );
    } else {
      // If there are multiple arguments, then we're aggregating selectors, so we need
      // to take the combineLatest of them before calling the map function.
      observable$ = combineLatest(observables).pipe(
        config.debounce ? debounceSync() : (source$) => source$,
        map((projectorArgs) => projector(...projectorArgs))
      );
    }

    return observable$.pipe(
      skipUndefined(),
      distinctUntilChanged(),
      share(shareConfig as ShareConfig<TResult>),
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
    ProvidedType = void,
    // The actual origin$ type, which could be unknown, when not specified
    OriginType extends
      | Observable<ProvidedType>
      | unknown = Observable<ProvidedType>,
    // Unwrapped actual type of the origin$ Observable, after default was applied
    ObservableType = OriginType extends Observable<infer A> ? A : never,
    // Return either an optional callback or a function requiring specific types as inputs
    ReturnType = ProvidedType | ObservableType extends void
      ? (
          observableOrValue?: ObservableType | Observable<ObservableType>
        ) => Subscription
      : (
          observableOrValue: ObservableType | Observable<ObservableType>
        ) => Subscription
  >(generator: (origin$: OriginType) => Observable<unknown>): ReturnType {
    const origin$ = new Subject<ObservableType>();
    generator(origin$ as OriginType)
      // tied to the lifecycle 👇 of ComponentStore
      .pipe(takeUntil(this.destroy$))
      .subscribe();

    return ((
      observableOrValue?: ObservableType | Observable<ObservableType>
    ): Subscription => {
      const observable$ = isObservable(observableOrValue)
        ? observableOrValue
        : of(observableOrValue);
      return observable$.pipe(takeUntil(this.destroy$)).subscribe((value) => {
        // any new 👇 value is pushed into a stream
        origin$.next(value as ObservableType);
      });
    }) as unknown as ReturnType;
  }

  #update<
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
  >(
    updaterFn: (state: TInternalState, value: TOriginType) => TInternalState
  ): TReturnType {
    return ((
      observableOrValue?: TOriginType | Observable<TOriginType>
    ): Subscription => {
      // We need to explicitly throw an error if a synchronous error occurs.
      // This is necessary to make synchronous errors catchable.
      let isSyncUpdate = true;
      let syncError: unknown;
      // We can receive either the value or an observable. In case it's a
      // simple value, we'll wrap it with `of` operator to turn it into
      // Observable.
      const observable$ = isObservable(observableOrValue)
        ? observableOrValue
        : of(observableOrValue);
      const subscription = observable$
        .pipe(
          // Push the value into queueScheduler
          observeOn(queueScheduler),
          withLatestFrom(
            this.#stateSubject$.pipe(startWith({} as TInternalState))
          ),
          map(([value, currentState]) =>
            updaterFn(currentState || ({} as TInternalState), value!)
          ),
          tap((newState) => this.#stateSubject$.next(newState)),
          catchError((error: unknown) => {
            if (isSyncUpdate) {
              syncError = error;
              return EMPTY;
            }

            return throwError(() => error);
          }),
          takeUntil(this.destroy$)
        )
        .subscribe();

      if (syncError) {
        throw syncError;
      }
      isSyncUpdate = false;

      return subscription;
    }) as TReturnType;
  }

  ngOnDestroy() {
    this.#destroySubject$.next();
    this.#destroySubject$.complete();
  }
}

type EffectFn<TValue> = (
  value: TValue
) =>
  | void
  | undefined
  | ((cleanUpParams: {
      prev: TValue | undefined;
      complete: boolean;
      error: boolean;
    }) => void);

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
  effectFn: EffectFn<TValue>
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

export function skipUndefined<TValue>(): MonoTypeOperatorFunction<TValue> {
  return filter<TValue>((value) => value !== undefined);
}

export function startWithUndefined<TValue>(): OperatorFunction<TValue, TValue> {
  return startWith<TValue>(undefined) as OperatorFunction<TValue, TValue>;
}

function processSelectorArgs<
  Selectors extends Array<Observable<unknown> | SelectConfig | ProjectorFn>,
  Result,
  ProjectorFn extends (...a: unknown[]) => Result
>(
  args: Selectors
): {
  observables: Observable<unknown>[];
  projector: ProjectorFn;
  config: Required<SelectConfig>;
} {
  const selectorArgs = Array.from(args);
  // Assign default values.
  let config: Required<SelectConfig> = {
    debounce: false,
  };
  let projector: ProjectorFn;
  // Last argument is either projector or config
  const projectorOrConfig = selectorArgs.pop() as ProjectorFn | SelectConfig;

  if (typeof projectorOrConfig !== 'function') {
    // We got the config as the last argument, replace any default values with it.
    config = { ...config, ...projectorOrConfig };
    // Pop the next args, which would be the projector fn.
    projector = selectorArgs.pop() as ProjectorFn;
  } else {
    projector = projectorOrConfig;
  }
  // The Observables to combine, if there are any.
  const observables = selectorArgs as Observable<unknown>[];
  return {
    observables,
    projector,
    config,
  };
}
