import * as THREE from 'three';
import type {
    NgtInstanceInternal,
    NgtRef,
    NgtState,
    NgtUnknownInstance,
    UnknownRecord,
} from '../types';

export const getInstanceRootState = (
    obj: THREE.Object3D
): NgtState | undefined =>
    ((obj as any).__ngt__ as NgtInstanceInternal)?.root();

export function prepare<TInstance extends object = UnknownRecord>(
    instance: TInstance,
    root: () => NgtState,
    parentInstance?: NgtRef,
    previousInstance?: NgtRef,
    isPrimitive = false
): NgtUnknownInstance<TInstance> {
    const parent = parentInstance
        ? parentInstance
        : previousInstance
        ? previousInstance.value?.__ngt__?.parent
        : undefined;

    return Object.assign(instance, {
        __ngt__: {
            root,
            primitive: !isPrimitive
                ? previousInstance?.value?.__ngt__?.primitive
                : isPrimitive,
            eventCount: previousInstance?.value?.__ngt__?.eventCount ?? 0,
            handlers: previousInstance?.value?.__ngt__?.handlers ?? {},
            objects: previousInstance?.value?.__ngt__?.objects ?? [],
            parent: parent ? (parent === instance ? null : parent) : null,
        },
    });
}
