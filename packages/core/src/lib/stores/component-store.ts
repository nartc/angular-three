import { Injectable, OnDestroy } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import {
    combineLatest,
    filter,
    isObservable,
    MonoTypeOperatorFunction,
    noop,
    Observable,
    ObservableInput,
    tap,
} from 'rxjs';
import type { NgtAnyRecord } from '../types';
import { is } from '../utils/is';

/**
 * a default Selector that consumers can quickly use for their selectors projector
 */
export const defaultProjector = () => ({});

/**
 * A custom operator that skips the first undefined value but allows subsequent undefined values.
 * NgRxComponentStore#select always emits the first value regardless of undefined or not after initialize
 */
export const skipFirstUndefined = <T>(): MonoTypeOperatorFunction<T> =>
    filter<T>((value, index) => index > 0 || value !== undefined);

export const filterFalsy = <T>(): MonoTypeOperatorFunction<T> => filter<T>((value): value is T => !!value);

type EffectFn<TValue> = (
    value: TValue
) => void | undefined | ((cleanUpParams: { prev: TValue | undefined; complete: boolean; error: boolean }) => void);

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
    let cleanupFn: (cleanUpParams: { prev: TValue | undefined; complete: boolean; error: boolean }) => void = noop;
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
export class NgtComponentStore<TState extends object = any, TInternalState extends object = TState & NgtAnyRecord>
    extends ComponentStore<TInternalState>
    implements OnDestroy
{
    constructor() {
        super({} as TInternalState);
        this.initialize();
    }

    // exposing get since THREE is imperative at its core
    // we need to imperatively get state sometimes for usages in Animation Loop
    // we also bind "this" instance, so we don't have to bind it later
    readonly read = this.get.bind(this);

    /**
     * A custom patchState that allows for:
     * - Partial state updates and Observable of partial state updates like patchState
     * - Pass a Record<string, ObservableInput> to update a specific key with an Observable.
     * This is similar to `RxState.connect()` API
     */
    write(
        partialStateOrFactory:
            | ((state: TInternalState) => Record<string, any>)
            | ((state: TInternalState) => Observable<Partial<TInternalState>>)
            | Observable<Partial<TInternalState>>
            | Record<string, any>
    ): void {
        if (typeof partialStateOrFactory === 'function') {
            return this.write(partialStateOrFactory(this.read()));
        }

        const partialState = partialStateOrFactory;
        if (Object.keys(partialState).length === 0) {
            return;
        }

        if (isObservable(partialState)) {
            return this.patchState(partialState as Observable<Partial<TInternalState>>);
        }

        const entries = Object.entries(partialState);
        const hasObservable = entries.some(([_, value]) => isObservable(value) && !is.ref(value));

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
            this.patchState(combineLatest(observableValues));
        }
    }

    protected initialize() {
        return;
    }

    /**
     * A utility class method to select a state on the template as Observable
     * - This method always debounce the Observable
     */
    selectKey<TKey extends keyof TInternalState & string>(
        key: TKey,
        skipFirst = false
    ): Observable<TInternalState[TKey]> {
        return this.select((s) => s[key], { debounce: true }).pipe(skipFirst ? skipFirstUndefined() : (s) => s);
    }

    /**
     * A utility class method to get a state on the template as imperative Value
     */
    readKey<TKey extends keyof TInternalState & string>(key: TKey): TInternalState[TKey] {
        return this.read((s) => s[key]);
    }

    // TODO: find out why some components trigger ngOnDestroy w/ stateSubject$ being undefined
    override ngOnDestroy() {
        if (this['stateSubject$']) {
            this['stateSubject$'].complete();
        }
        if (this['destroySubject$']) {
            this['destroySubject$'].next();
        }
    }
}
