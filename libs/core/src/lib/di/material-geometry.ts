import { Provider } from '@angular/core';
import { NgtMaterialGeometry } from '../abstracts/material-geometry';
import { Ref } from '../ref';
import { NGT_MATERIAL_GEOMETRY_OBJECT_REF } from '../tokens';
import type { AnyConstructor } from '../types';
import { provideObjectRef } from './object';

export function provideMaterialGeometryObjectRef<
    TType extends AnyConstructor<any>
>(
    subMaterialGeometryType: TType,
    factory?: (instance: InstanceType<TType>) => Ref
): Provider {
    return [
        provideObjectRef(subMaterialGeometryType, factory),
        { provide: NgtMaterialGeometry, useExisting: subMaterialGeometryType },
        {
            provide: NGT_MATERIAL_GEOMETRY_OBJECT_REF,
            useFactory: (instance: InstanceType<TType>) => {
                return () => factory?.(instance) || instance.instance;
            },
            deps: [subMaterialGeometryType],
        },
    ];
}
