import { ComponentStore } from '@ngrx/component-store';
import {
  BehaviorSubject,
  isObservable,
  MonoTypeOperatorFunction,
  noop,
  Observable,
  of,
  Subject,
  Subscription,
  takeUntil,
  tap,
} from 'rxjs';
import { UnknownRecord } from '../models';

export type StoreState<TStore extends EnhancedComponentStore> =
  TStore extends EnhancedComponentStore<infer TComponentState>
    ? TComponentState
    : {};

export type StoreStateKeys<TState extends object> = Array<
  keyof TState & string
>;

export type StoreSelectors<TState extends object> = {
  [K in StoreStateKeys<TState>[number] as `${K}$`]: Observable<TState[K]>;
};

export type StoreUpdaters<TState extends object> = {
  [K in StoreStateKeys<TState>[number] as `set${Capitalize<K>}`]: (
    value: TState[K]
  ) => void;
};

export type AsyncStoreUpdaters<TState extends object> = {
  [K in StoreStateKeys<TState>[number] as `set${Capitalize<K>}`]: (
    observableValue: Observable<TState[K]>
  ) => Subscription;
};

export function getSelectors<TStore extends EnhancedComponentStore>(
  store: TStore
): StoreSelectors<StoreState<TStore>> {
  let state: StoreState<TStore>;

  try {
    state = (store as unknown as { get: () => StoreState<TStore> }).get();
  } catch (e) {
    throw new Error('ComponentStore is initialized lazily.');
  }

  return Object.keys(state).reduce((selectors, key) => {
    (selectors as UnknownRecord)[`${key}$`] = store.select(
      (s) => (s as UnknownRecord)[key]
    );
    return selectors;
  }, {} as StoreSelectors<StoreState<TStore>>);
}

export function capitalize<T extends string>(str: T): Capitalize<T> {
  return (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<T>;
}

export function getUpdaters<TStore extends EnhancedComponentStore>(
  store: TStore
): StoreUpdaters<StoreState<TStore>> & AsyncStoreUpdaters<StoreState<TStore>> {
  let state: StoreState<TStore>;

  try {
    state = (store as unknown as { get: () => StoreState<TStore> }).get();
  } catch (e) {
    throw new Error('ComponentStore is initialized lazily.');
  }

  return Object.keys(state).reduce((updaters, key) => {
    (updaters as UnknownRecord)[`set${capitalize(key)}`] = store.updater(
      (state, value) => ({
        ...state,
        [key]: value,
      })
    );

    return updaters;
  }, {} as StoreUpdaters<StoreState<TStore>> & AsyncStoreUpdaters<StoreState<TStore>>);
}

export interface EnhancedEffectReturn<ObservableType> {
  get hasRunOnce(): boolean;

  set hasRunOnce(v: boolean);

  setCleanupFn: (
    cleanupFn: (value: ObservableType | undefined) => void
  ) => void;
}

export abstract class EnhancedComponentStore<
  TState extends object = any
> extends ComponentStore<TState> {
  readonly selectors: StoreSelectors<TState> = getSelectors(this);
  readonly updaters: StoreUpdaters<TState> & AsyncStoreUpdaters<TState> =
    getUpdaters(this) as unknown as StoreUpdaters<TState> &
      AsyncStoreUpdaters<TState>;

  private readonly $imperative: BehaviorSubject<TState>;

  protected constructor(state: TState) {
    super(state);
    this.$imperative = new BehaviorSubject<TState>(state);
    this.watchImperative(this.state$);
  }

  private readonly watchImperative = this.effect<TState>((state$) =>
    state$.pipe(
      tap((state) => {
        this.$imperative.next(state);
      })
    )
  );

  /**
   *
   * @deprecated use {@link tapEffect} with {@link ComponentStore.prototype.effect} instead
   */
  enhancedEffect<
    // This type quickly became part of effect 'API'
    ProvidedType = void,
    // The actual origin$ type, which could be unknown, when not specified
    OriginType extends
      | Observable<ProvidedType>
      | unknown = Observable<ProvidedType>,
    // Unwrapped actual type of the origin$ Observable, after default was applied
    ObservableType = OriginType extends Observable<infer A> ? A : never,
    // Return either an empty callback or a function requiring specific types as inputs
    ReturnType = ProvidedType | ObservableType extends void
      ? () => void
      : (
          observableOrValue: ObservableType | Observable<ObservableType>
        ) => Subscription
  >(
    generator: (origin$: OriginType) => Observable<unknown>
  ): ReturnType & EnhancedEffectReturn<ObservableType> {
    const origin$ = new Subject<ObservableType>();
    generator(origin$ as OriginType)
      // tied to the lifecycle 👇 of ComponentStore
      .pipe(takeUntil(this.destroy$))
      .subscribe();

    let cleanupFn: (value: ObservableType | undefined) => void;
    let latestValue: ObservableType | undefined;

    const fn = ((
      observableOrValue?: ObservableType | Observable<ObservableType>
    ): Subscription => {
      const observable$ = isObservable(observableOrValue)
        ? observableOrValue
        : of(observableOrValue);
      return observable$
        .pipe(
          tap({
            next: (value) => {
              // if effect has run at least once, and cleanup is defined,
              // run cleanup first with the previous value
              if (fn.hasRunOnce && cleanupFn) {
                cleanupFn(latestValue);
              }

              latestValue = value;
              // any new 👇 value is pushed into a stream
              origin$.next(value as ObservableType);

              // flip hasRunOnce after origin$ emits the first value
              if (!fn.hasRunOnce) {
                fn.hasRunOnce = true;
              }
            },
            unsubscribe: () => {
              if (cleanupFn) {
                cleanupFn(latestValue);
              }
            },
          }),
          takeUntil(this.destroy$)
        )
        .subscribe();
    }) as unknown as ReturnType & EnhancedEffectReturn<ObservableType>;

    // init w/ false meaning that the effectFn has not been invoked yet upon creation
    fn.hasRunOnce = false;

    // always define setCleanupFn
    fn.setCleanupFn = (cleanup) => {
      cleanupFn = cleanup;
    };

    return fn;
  }

  getImperativeState(): TState {
    return this.$imperative.getValue();
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
export function tapEffect<T>(
  effectFn: (
    value: T,
    firstRun: boolean
  ) => ((previousValue: T | undefined) => void) | void
): MonoTypeOperatorFunction<T> {
  let cleanupFn: (previousValue: T | undefined) => void = noop;
  let firstRun = false;
  let latestValue: T | undefined = undefined;

  return tap<T>({
    next: (value: T) => {
      if (cleanupFn && firstRun) {
        cleanupFn(latestValue);
      }

      const cleanUpOrVoid = effectFn(value, firstRun);
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
        cleanupFn(latestValue);
      }
    },
  });
}
