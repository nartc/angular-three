import { Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtObject } from '../abstracts/object';
import { NgtCommonLight } from '../three/light';
import { NGT_COMMON_LIGHT_FACTORY } from '../tokens';
import type { AnyConstructor, AnyFunction } from '../types';
import { provideObjectFactory } from './object';

export function provideCommonLightFactory<
    TLight extends THREE.Light,
    TSubLight extends NgtCommonLight<TLight> = NgtCommonLight<TLight>
>(
    subLightType: AnyConstructor<TSubLight>,
    factory?: (sub: TSubLight) => THREE.Object3D
): Provider {
    return [
        provideObjectFactory(
            subLightType as unknown as AnyConstructor<NgtObject>,
            factory as AnyFunction
        ),
        { provide: NgtCommonLight, useExisting: subLightType },
        {
            provide: NGT_COMMON_LIGHT_FACTORY,
            useFactory: (subLight: TSubLight) => {
                return () => factory?.(subLight) || subLight.instance.value;
            },
            deps: [subLightType],
        },
    ];
}
