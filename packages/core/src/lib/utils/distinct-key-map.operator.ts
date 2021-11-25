import {
  distinctUntilKeyChanged,
  map,
  Observable,
  OperatorFunction,
  pipe,
} from 'rxjs';

export function distinctKeyMap<T extends object, TKey extends keyof T>(
  key: TKey
): OperatorFunction<T, T[TKey]> {
  return pipe<Observable<T>, Observable<T>, Observable<T[TKey]>>(
    distinctUntilKeyChanged(key),
    map((data) => data[key])
  );
}
