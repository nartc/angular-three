import { Provider } from '@angular/core';
import { NgtMaterialGeometry } from '../abstracts/material-geometry';
import { NGT_MATERIAL_GEOMETRY_OBJECT_FACTORY } from '../tokens';
import type { AnyConstructor, NgtRef } from '../types';
import { provideObjectRef } from './object';

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
                return () => factory?.(instance) || instance.instance;
            },
            deps: [subMaterialGeometryType],
        },
    ];
}
