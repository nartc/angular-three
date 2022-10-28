import { NgtRef } from '../ref';
import type {
  NgtInstanceLocalState,
  NgtInstanceNode,
  NgtStateGetter,
  UnknownRecord,
} from '../types';
import { applyProps } from './apply-props';
import { is } from './is';

export function getInstanceInternal<T extends object = UnknownRecord>(
  obj: T | undefined
): NgtInstanceLocalState | undefined {
  if (!obj) return undefined;
  return (obj as UnknownRecord)['__ngt__'] as NgtInstanceLocalState;
}

export function prepare<TInstance extends object = UnknownRecord>(
  instance: TInstance,
  rootGetter: NgtStateGetter,
  parentInstance?: NgtRef,
  previousInstance?: NgtRef,
  isPrimitive = false
): NgtInstanceNode<TInstance> {
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
      stateGetter: rootGetter,
      primitive: !isPrimitive
        ? previousInstanceInternal?.primitive
        : isPrimitive,
      eventCount: previousInstanceInternal?.eventCount ?? 0,
      handlers: previousInstanceInternal?.handlers ?? {},
      objects: previousInstanceInternal?.objects ?? new NgtRef([] as NgtRef[]),
      parent: parent ? (parent === instance ? null : parent) : null,
    },
  });
}
