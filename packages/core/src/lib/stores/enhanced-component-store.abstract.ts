import { ComponentStore } from '@ngrx/component-store';
import { BehaviorSubject, Observable, tap } from 'rxjs';

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
    (selectors as Record<string, unknown>)[`${key}$`] = store.select(
      (s) => (s as Record<string, unknown>)[key]
    );
    return selectors;
  }, {} as StoreSelectors<StoreState<TStore>>);
}

export abstract class EnhancedComponentStore<
  TState extends object = any
> extends ComponentStore<TState> {
  readonly selectors: StoreSelectors<TState> = getSelectors(this);

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
