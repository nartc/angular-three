import { Provider } from '@angular/core';
import { NgtCommonMaterial } from '../three/material';
import { NGT_COMMON_MATERIAL_REF } from '../tokens';
import type { AnyConstructor, NgtRef } from '../types';
import { provideInstanceRef } from './instance';

export function provideCommonMaterialRef<TType extends AnyConstructor<any>>(
    subMaterialType: TType,
    factory?: (instance: InstanceType<TType>) => NgtRef
): Provider {
    return [
        provideInstanceRef(subMaterialType, factory),
        { provide: NgtCommonMaterial, useExisting: subMaterialType },
        {
            provide: NGT_COMMON_MATERIAL_REF,
            useFactory: (instance: InstanceType<TType>) => {
                return () => factory?.(instance) || instance.instance;
            },
            deps: [subMaterialType],
        },
    ];
}
