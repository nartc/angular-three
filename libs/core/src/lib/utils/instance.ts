import { Ref } from '../ref';
import type { NgtInstanceInternal, NgtState, NgtUnknownInstance, UnknownRecord } from '../types';
import { applyProps } from './apply-props';
import { is } from './is';

export function getInstanceInternal<T extends object = UnknownRecord>(
  obj: T | undefined
): NgtInstanceInternal | undefined {
  if (!obj) return undefined;
  return (obj as UnknownRecord)['__ngt__'] as NgtInstanceInternal;
}

export function prepare<TInstance extends object = UnknownRecord>(
  instance: TInstance,
  root: () => NgtState,
  parentInstance?: Ref,
  previousInstance?: Ref,
  isPrimitive = false
): NgtUnknownInstance<TInstance> {
  const previousInstanceInternal = getInstanceInternal(previousInstance?.value);

  const parent = parentInstance
    ? parentInstance
    : previousInstanceInternal
    ? previousInstanceInternal.parent
    : undefined;

  if (is.scene(instance)) {
    applyProps(instance, { dispose: null });
  }

  return Object.assign(instance, {
    __ngt__: {
      root,
      primitive: !isPrimitive ? previousInstanceInternal?.primitive : isPrimitive,
      eventCount: previousInstanceInternal?.eventCount ?? 0,
      handlers: previousInstanceInternal?.handlers ?? {},
      objects: previousInstanceInternal?.objects ?? new Ref([] as Ref[]),
      parent: parent ? (parent === instance ? null : parent) : null,
    },
  });
}
