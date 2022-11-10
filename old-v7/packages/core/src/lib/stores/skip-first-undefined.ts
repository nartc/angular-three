import { filter, MonoTypeOperatorFunction } from 'rxjs';

/**
 * A custom operator that skips the first undefined value but allows subsequent undefined values.
 */
export function skipFirstUndefined<T>(): MonoTypeOperatorFunction<T> {
  return filter<T>((value, index) => index > 0 || value !== undefined);
}
