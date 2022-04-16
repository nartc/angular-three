import { Provider } from '@angular/core';
import { NgtCommonMesh } from '../three/mesh';
import { NGT_COMMON_MESH_REF } from '../tokens';
import type { AnyConstructor, NgtRef } from '../types';
import { provideMaterialGeometryObjectRef } from './material-geometry';

export function provideCommonMeshRef<TType extends AnyConstructor<any>>(
    subMeshType: TType,
    factory?: (instance: InstanceType<TType>) => NgtRef
): Provider {
    return [
        provideMaterialGeometryObjectRef(subMeshType, factory),
        { provide: NgtCommonMesh, useExisting: subMeshType },
        {
            provide: NGT_COMMON_MESH_REF,
            useFactory: (instance: InstanceType<TType>) => {
                return () => factory?.(instance) || instance.instance;
            },
            deps: [subMeshType],
        },
    ];
}
