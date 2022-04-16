import { Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtInstance } from '../abstracts/instance';
import { NgtCommonMaterial } from '../three/material';
import {
    NGT_COMMON_MATERIAL_FACTORY,
    NGT_COMMON_MATERIAL_REF,
} from '../tokens';
import type { AnyConstructor, AnyFunction, NgtRef } from '../types';
import { provideInstanceFactory, provideInstanceRef } from './instance';

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
                return () =>
                    factory?.(subMaterial) || subMaterial.instance.value;
            },
            deps: [subMaterialType],
        },
    ];
}

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
                return factory?.(instance) || instance.instance;
            },
            deps: [subMaterialType],
        },
    ];
}
