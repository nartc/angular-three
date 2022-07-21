import * as THREE from 'three';
import { Ref } from '../ref';
import type { NgtInstanceInternal, NgtState, NgtUnknownInstance, UnknownRecord } from '../types';
import { applyProps } from './apply-props';
import { is } from './is';

export const getInstanceRootState = (obj: THREE.Object3D): NgtState | undefined =>
  ((obj as any).__ngt__ as NgtInstanceInternal)?.root();

export function prepare<TInstance extends object = UnknownRecord>(
  instance: TInstance,
  root: () => NgtState,
  parentInstance?: Ref,
  previousInstance?: Ref,
  isPrimitive = false
): NgtUnknownInstance<TInstance> {
  const parent = parentInstance
    ? parentInstance
    : previousInstance
    ? previousInstance.value?.__ngt__?.parent
    : undefined;

  if (is.scene(instance)) {
    applyProps(instance as unknown as NgtUnknownInstance, {
      dispose: null,
    });
  }

  return Object.assign(instance, {
    __ngt__: {
      root,
      primitive: !isPrimitive ? previousInstance?.value?.__ngt__?.primitive : isPrimitive,
      eventCount: previousInstance?.value?.__ngt__?.eventCount ?? 0,
      handlers: previousInstance?.value?.__ngt__?.handlers ?? {},
      objects: previousInstance?.value?.__ngt__?.objects ?? new Ref([]),
      parent: parent ? (parent === instance ? null : parent) : null,
    },
  });
}
