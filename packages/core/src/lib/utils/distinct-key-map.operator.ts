import { distinctUntilKeyChanged, map, OperatorFunction, pipe } from 'rxjs';

export function distinctKeyMap<T extends object, TKey extends keyof T>(
  key: TKey
): OperatorFunction<T, T[TKey]> {
  return pipe(
    distinctUntilKeyChanged(key),
    map((data) => data[key])
  );
}
