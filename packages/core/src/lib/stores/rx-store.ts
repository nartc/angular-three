import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { MonoTypeOperatorFunction, Observable, startWith, tap } from 'rxjs';

export const startWithUndefined = <T>(): MonoTypeOperatorFunction<T> => startWith<T>(undefined! as T);

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
    let cleanupFn: (cleanUpParams: { prev: TValue | undefined; complete: boolean; error: boolean }) => void = () => {};
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
export class NgtRxStore<
    TState extends object = any,
    TInternalState extends object = TState & Record<string, any>
> extends RxState<TInternalState> {
    constructor() {
        super();
        // set a dummy property so that initial this.get() won't return undefined
        this.set({ __ngt__dummy__: '__ngt__dummy__' } as TInternalState);
        this.initialize();
    }

    protected initialize() {
        return;
    }

    effect<S>(obs: Observable<S>, sideEffectFn: EffectFn<S>): void {
        return this.hold(obs.pipe(tapEffect(sideEffectFn)));
    }
}
