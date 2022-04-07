import { InjectionToken, Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtInstance } from '../abstracts/instance';
import { NgtCommonMaterial } from '../three/material';
import type { AnyConstructor } from '../types';
import { provideInstanceFactory } from './instance';

export const NGT_COMMON_MATERIAL_FACTORY = new InjectionToken(
    'NgtCommonMaterial factory'
);

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
            subMaterialType as unknown as AnyConstructor<NgtInstance<TMaterial>>
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
