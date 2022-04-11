import { Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtMaterialGeometry } from '../abstracts/material-geometry';
import { NgtObject } from '../abstracts/object';
import { NGT_MATERIAL_GEOMETRY_OBJECT_FACTORY } from '../tokens';
import type { AnyConstructor } from '../types';
import { provideObjectFactory } from './object';

export function provideMaterialGeometryObjectFactory<
    TObject extends THREE.Object3D,
    TSubMaterialGeometry extends NgtMaterialGeometry<TObject> = NgtMaterialGeometry<TObject>
>(
    subMaterialGeometryType: AnyConstructor<TSubMaterialGeometry>,
    factory?: (sub: TSubMaterialGeometry) => TObject
): Provider {
    return [
        provideObjectFactory(
            subMaterialGeometryType as unknown as AnyConstructor<NgtObject>
        ),
        { provide: NgtMaterialGeometry, useExisting: subMaterialGeometryType },
        {
            provide: NGT_MATERIAL_GEOMETRY_OBJECT_FACTORY,
            useFactory: (subMaterialGeometryObject: TSubMaterialGeometry) => {
                return () =>
                    factory?.(subMaterialGeometryObject) ||
                    subMaterialGeometryObject.object3d;
            },
            deps: [subMaterialGeometryType],
        },
    ];
}
