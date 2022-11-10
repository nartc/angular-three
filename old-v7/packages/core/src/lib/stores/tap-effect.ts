import { MonoTypeOperatorFunction, noop, tap } from 'rxjs';

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
