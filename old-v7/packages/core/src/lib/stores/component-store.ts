import { Directive } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { combineLatest, isObservable, Observable, ObservableInput } from 'rxjs';
import { NgtRef } from '../ref';
import { skipFirstUndefined } from './skip-first-undefined';

@Directive()
export abstract class NgtComponentStore<
  TState extends object = any,
  TInternalState extends object = TState & { [key: string]: any }
> extends ComponentStore<TInternalState> {
  constructor() {
    super({} as TInternalState);
    this.initialize();
  }

  // exposing get since THREE is imperative at its core
  // we need to imperatively get state sometimes for usages in Animation Loop
  // we also bind "this" instance, so we don't have to bind it later
  readonly getState = this.get.bind(this);

  // a default Selector that consumers can quickly use for their selectors projector
  readonly defaultProjector = () => ({});

  /**
   * A custom patchState that allows for:
   * - Partial state updates and Observable of partial state updates like patchState
   * - Pass a Record<string, ObservableInput> to update a specific key with an Observable.
   * This is similar to `RxState.connect()` API
   */
  set(
    partialStateOrFactory:
      | ((state: TInternalState) => Record<string, any>)
      | ((state: TInternalState) => Observable<Partial<TInternalState>>)
      | Observable<Partial<TInternalState>>
      | Record<string, any>
  ): void {
    if (typeof partialStateOrFactory === 'function') {
      return this.set(partialStateOrFactory(this.getState()));
    }

    const partialState = partialStateOrFactory;
    if (Object.keys(partialState).length === 0) {
      return;
    }

    if (isObservable(partialState)) {
      return this.patchState(partialState as Observable<Partial<TInternalState>>);
    }

    const entries = Object.entries(partialState);
    const hasObservable = entries.some(([_, value]) => isObservable(value) && !(value instanceof NgtRef));

    if (!hasObservable) {
      return this.patchState(partialState as Partial<TInternalState>);
    }

    const [rawValues, observableValues] = entries.reduce(
      (result, [key, value]) => {
        if (isObservable(value)) {
          result[1][key as keyof TInternalState] = value;
        } else {
          result[0][key as keyof TInternalState] = value as TInternalState[keyof TInternalState];
        }
        return result;
      },
      [{}, {}] as [Partial<TInternalState>, Record<keyof TInternalState, ObservableInput<any>>]
    );

    if (Object.keys(rawValues).length > 0) {
      this.patchState(rawValues);
    }

    if (Object.keys(observableValues).length > 0) {
      // noinspection JSDeprecatedSymbols
      this.patchState(combineLatest(observableValues));
    }
  }

  /**
   * Subclasses can override this to run initialize logic in constructor.
   * **DO NOT RUN** THREE effects in this method because it still runs in Angular Zone
   * @protected
   */
  protected initialize() {
    return;
  }

  read<TKey extends keyof TInternalState & string>(key: TKey, skipFirst = false): Observable<TInternalState[TKey]> {
    return this.select((s) => s[key]).pipe(skipFirst ? skipFirstUndefined() : (o) => o);
  }
}
