import { Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtMaterialGeometry } from '../abstracts/material-geometry';
import { NgtCommonMesh } from '../three/mesh';
import { NGT_COMMON_MESH_FACTORY, NGT_COMMON_MESH_REF } from '../tokens';
import type { AnyConstructor, AnyFunction, NgtRef } from '../types';
import {
    provideMaterialGeometryObjectFactory,
    provideMaterialGeometryObjectRef,
} from './material-geometry';

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
                return () => factory?.(subMesh) || subMesh.instance.value;
            },
            deps: [subMeshType],
        },
    ];
}

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
                return factory?.(instance) || instance.instance;
            },
            deps: [subMeshType],
        },
    ];
}
