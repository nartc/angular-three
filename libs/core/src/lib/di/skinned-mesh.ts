import { Provider } from '@angular/core';
import {
    NGT_HOST_BONE_REF,
    NGT_HOST_SKELETON_REF,
    NGT_HOST_SKINNED_MESH_REF,
} from '../tokens';
import type { AnyConstructor, NgtRef } from '../types';

export function provideSkinnedMeshHostRef<TType extends AnyConstructor<any>>(
    subType: TType,
    factory: (instance: InstanceType<TType>) => NgtRef
): Provider {
    return {
        provide: NGT_HOST_SKINNED_MESH_REF,
        useFactory: factory,
        deps: [subType],
    };
}

export function provideSkeletonHostRef<TType extends AnyConstructor<any>>(
    subType: TType,
    factory: (instance: InstanceType<TType>) => NgtRef
): Provider {
    return {
        provide: NGT_HOST_SKELETON_REF,
        useFactory: factory,
        deps: [subType],
    };
}

export function provideBoneHostRef<TType extends AnyConstructor<any>>(
    subType: TType,
    factory: (instance: InstanceType<TType>) => NgtRef
): Provider {
    return {
        provide: NGT_HOST_BONE_REF,
        useFactory: factory,
        deps: [subType],
    };
}
