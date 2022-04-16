import { Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtMaterialGeometry } from '../abstracts/material-geometry';
import { NgtObject } from '../abstracts/object';
import { NGT_MATERIAL_GEOMETRY_OBJECT_FACTORY } from '../tokens';
import type { AnyConstructor, AnyFunction, NgtRef } from '../types';
import { provideObjectFactory, provideObjectRef } from './object';

export function provideMaterialGeometryObjectFactory<
    TObject extends THREE.Object3D,
    TSubMaterialGeometry extends NgtMaterialGeometry<TObject> = NgtMaterialGeometry<TObject>
>(
    subMaterialGeometryType: AnyConstructor<TSubMaterialGeometry>,
    factory?: (sub: TSubMaterialGeometry) => TObject
): Provider {
    return [
        provideObjectFactory(
            subMaterialGeometryType as unknown as AnyConstructor<NgtObject>,
            factory as AnyFunction
        ),
        { provide: NgtMaterialGeometry, useExisting: subMaterialGeometryType },
        {
            provide: NGT_MATERIAL_GEOMETRY_OBJECT_FACTORY,
            useFactory: (subMaterialGeometryObject: TSubMaterialGeometry) => {
                return () =>
                    factory?.(subMaterialGeometryObject) ||
                    subMaterialGeometryObject.instance.value;
            },
            deps: [subMaterialGeometryType],
        },
    ];
}

export function provideMaterialGeometryObjectRef<
    TType extends AnyConstructor<any>
>(
    subMaterialGeometryType: TType,
    factory?: (instance: InstanceType<TType>) => NgtRef
): Provider {
    return [
        provideObjectRef(subMaterialGeometryType, factory),
        { provide: NgtMaterialGeometry, useExisting: subMaterialGeometryType },
        {
            provide: NGT_MATERIAL_GEOMETRY_OBJECT_FACTORY,
            useFactory: (instance: InstanceType<TType>) => {
                return factory?.(instance) || instance.instance;
            },
            deps: [subMaterialGeometryType],
        },
    ];
}
