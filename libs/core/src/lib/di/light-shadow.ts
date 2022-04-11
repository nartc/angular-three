import { InjectionToken, Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtInstance } from '../abstracts/instance';
import { NgtCommonLightShadow } from '../three/light-shadow';
import type { AnyConstructor } from '../types';
import { provideInstanceFactory } from './instance';

export const NGT_COMMON_LIGHT_SHADOW_FACTORY = new InjectionToken(
    'NgtCommonAttribute factory'
);

export function provideCommonLightShadowFactory<
    TLightShadow extends THREE.LightShadow,
    TSubLightShadow extends NgtCommonLightShadow<TLightShadow> = NgtCommonLightShadow<TLightShadow>
>(
    subLightShadowType: AnyConstructor<TSubLightShadow>,
    factory?: (sub: TSubLightShadow) => TLightShadow
): Provider {
    return [
        provideInstanceFactory<TLightShadow>(
            subLightShadowType as unknown as AnyConstructor<
                NgtInstance<TLightShadow>
            >
        ),
        { provide: NgtCommonLightShadow, useExisting: subLightShadowType },
        {
            provide: NGT_COMMON_LIGHT_SHADOW_FACTORY,
            useFactory: (subLightShadow: TSubLightShadow) => {
                return () =>
                    factory?.(subLightShadow) || subLightShadow.lightShadow;
            },
            deps: [subLightShadowType],
        },
    ];
}
