import { Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtMaterialGeometry } from '../abstracts/material-geometry';
import { NgtCommonMesh } from '../three/mesh';
import { NGT_COMMON_MESH_FACTORY } from '../tokens';
import type { AnyConstructor, AnyFunction } from '../types';
import { provideMaterialGeometryObjectFactory } from './material-geometry';

export function provideCommonMeshFactory<
    TMesh extends THREE.Mesh,
    TSubMesh extends NgtCommonMesh<TMesh> = NgtCommonMesh<TMesh>
>(
    subMeshType: AnyConstructor<TSubMesh>,
    factory?: (sub: TSubMesh) => TMesh
): Provider {
    return [
        provideMaterialGeometryObjectFactory(
            subMeshType as unknown as AnyConstructor<NgtMaterialGeometry>,
            factory as AnyFunction
        ),
        { provide: NgtCommonMesh, useExisting: subMeshType },
        {
            provide: NGT_COMMON_MESH_FACTORY,
            useFactory: (subMesh: TSubMesh) => {
                return () => factory?.(subMesh) || subMesh.object3d;
            },
            deps: [subMeshType],
        },
    ];
}
