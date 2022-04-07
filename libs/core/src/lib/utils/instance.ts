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
    isPrimitive = false
): NgtUnknownInstance<TInstance> {
    return Object.assign(instance, {
        __ngt__: {
            root,
            primitive: isPrimitive,
            eventCount: 0,
            handlers: {},
            objects: [],
            parent: parentInstance || null,
        },
    });
}
