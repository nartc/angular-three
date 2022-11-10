import type { NgtUnknownRecord } from '../types';
import { applyProps } from './apply-props';

export function mutate<T extends NgtUnknownRecord>(object: T, value: unknown, paths: string[] = []): void {
  const [base, ...remaining] = paths;

  if (!base) return;

  if (remaining.length === 0) {
    applyProps(object, { [base]: value });
  } else {
    // assign an empty object in order to spread object if undefined
    assignEmpty(object, base);
    // recursion
    mutate(object[base] as NgtUnknownRecord, value, remaining);
  }
}

function assignEmpty(obj: NgtUnknownRecord, base: string) {
  if (
    // @ts-ignore
    (!Object.hasOwn(obj, base) && Reflect && !!Reflect.has && !Reflect.has(obj, base)) ||
    obj[base] === undefined
  ) {
    obj[base] = {};
  }
}
