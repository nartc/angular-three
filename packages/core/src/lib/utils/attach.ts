import type { NgtAnyRecord, NgtAttachFunction } from '../types';
import { applyProps } from './apply-props';
import { instanceLocalState } from './instance-local-state';

export function attach<T extends NgtAnyRecord>(
  object: T,
  value: unknown,
  paths: string[] = []
): void {
  const [base, ...remaining] = paths;

  if (!base) return;

  if (remaining.length === 0) {
    applyProps(object, { [base]: value });
  } else {
    // assign an empty object in order to spread object if undefined
    assignEmpty(object, base);
    // recursion
    attach(object[base], value, remaining);
  }
}

export function detach<TParent extends NgtAnyRecord, TChild extends NgtAnyRecord>(
  object: TParent,
  child: TChild,
  attachProp: string[] | NgtAttachFunction
) {
  const childLocalState = instanceLocalState(child);
  if (Array.isArray(attachProp)) {
    const previous = childLocalState?.previousAttach;
    attach(object, previous, attachProp);
  } else {
    (childLocalState?.previousAttach as () => void)();
  }
}

function assignEmpty(obj: NgtAnyRecord, base: string) {
  if (
    // @ts-ignore
    (!Object.hasOwn(obj, base) && Reflect && !!Reflect.has && !Reflect.has(obj, base)) ||
    obj[base] === undefined
  ) {
    obj[base] = {};
  }
}

export function resolve(obj: NgtAnyRecord, paths: string[]) {
  return paths.reduce((value, property) => value[property as any], obj);
}
