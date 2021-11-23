import { ComponentStore } from '@ngrx/component-store';
// import { names } from '@nrwl/devkit';
import { BehaviorSubject, Observable, Subscription, tap } from 'rxjs';
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
    this.watchImperativeEffect(this.state$);
  }

  private readonly watchImperativeEffect = this.effect<TState>((state$) =>
    state$.pipe(
      tap((state) => {
        this.$imperative.next(state);
      })
    )
  );

  getImperativeState(): TState {
    return this.$imperative.getValue();
  }
}
