import { Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtInstance } from '../abstracts/instance';
import { NgtCommonMaterial } from '../three/material';
import { NGT_COMMON_MATERIAL_FACTORY } from '../tokens';
import type { AnyConstructor, AnyFunction } from '../types';
import { provideInstanceFactory } from './instance';

export function provideCommonMaterialFactory<
    TMaterial extends THREE.Material,
    TMaterialParameters extends THREE.MaterialParameters,
    TSubMaterial extends NgtCommonMaterial<
        TMaterialParameters,
        TMaterial
    > = NgtCommonMaterial<TMaterialParameters, TMaterial>
>(
    subMaterialType: AnyConstructor<TSubMaterial>,
    factory?: (sub: TSubMaterial) => TMaterial
): Provider {
    return [
        provideInstanceFactory<TMaterial>(
            subMaterialType as unknown as AnyConstructor<
                NgtInstance<TMaterial>
            >,
            factory as AnyFunction
        ),
        { provide: NgtCommonMaterial, useExisting: subMaterialType },
        {
            provide: NGT_COMMON_MATERIAL_FACTORY,
            useFactory: (subMaterial: TSubMaterial) => {
                return () => factory?.(subMaterial) || subMaterial.material;
            },
            deps: [subMaterialType],
        },
    ];
}
