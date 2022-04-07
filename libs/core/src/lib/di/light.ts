import { InjectionToken, Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtObject } from '../abstracts/object';
import { NgtCommonLight } from '../three/light';
import type { AnyConstructor } from '../types';
import { provideObjectFactory } from './object';

export const NGT_COMMON_LIGHT_FACTORY = new InjectionToken(
    'NgtCommonLight factory'
);

export function provideCommonLightFactory<TSubLight extends NgtCommonLight>(
    subLightType: AnyConstructor<TSubLight>,
    factory?: (sub: TSubLight) => THREE.Object3D
): Provider {
    return [
        provideObjectFactory(
            subLightType as unknown as AnyConstructor<NgtObject>
        ),
        { provide: NgtCommonLight, useExisting: subLightType },
        {
            provide: NGT_COMMON_LIGHT_FACTORY,
            useFactory: (subLight: TSubLight) => {
                return () => factory?.(subLight) || subLight.object3d;
            },
            deps: [subLightType],
        },
    ];
}
