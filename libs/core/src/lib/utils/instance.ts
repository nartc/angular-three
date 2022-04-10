import * as THREE from 'three';
import type {
    NgtInstanceInternal,
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
    parentInstance?: NgtUnknownInstance,
    previousInstance?: NgtUnknownInstance,
    isPrimitive = false
): NgtUnknownInstance<TInstance> {
    return Object.assign(instance, {
        __ngt__: {
            root,
            primitive: !isPrimitive
                ? previousInstance
                    ? previousInstance.__ngt__.primitive
                    : isPrimitive
                : isPrimitive,
            eventCount: previousInstance
                ? previousInstance.__ngt__.eventCount
                : 0,
            handlers: previousInstance ? previousInstance.__ngt__.handlers : {},
            objects: previousInstance ? previousInstance.__ngt__.objects : [],
            parent: parentInstance
                ? parentInstance
                : previousInstance
                ? previousInstance.__ngt__.parent
                : null,
        },
    });
}
