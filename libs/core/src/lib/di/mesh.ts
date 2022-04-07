import { InjectionToken, Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtMaterialGeometry } from '../abstracts/material-geometry';
import { NgtCommonMesh } from '../three/mesh';
import type { AnyConstructor, AnyFunction } from '../types';
import { provideMaterialGeometryObjectFactory } from './material-geometry';

export const NGT_COMMON_MESH_FACTORY = new InjectionToken<AnyFunction>(
    'NgtCommonMesh factory'
);

export function provideCommonMeshFactory<TSubMesh extends NgtCommonMesh>(
    subMeshType: AnyConstructor<TSubMesh>,
    factory?: (sub: TSubMesh) => THREE.Object3D
): Provider {
    return [
        provideMaterialGeometryObjectFactory(
            subMeshType as unknown as AnyConstructor<NgtMaterialGeometry>
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
