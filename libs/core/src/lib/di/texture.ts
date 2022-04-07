import { InjectionToken, Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtInstance } from '../abstracts/instance';
import { NgtCommonTexture } from '../three/texture';
import type { AnyConstructor } from '../types';
import { provideInstanceFactory } from './instance';

export const NGT_COMMON_TEXTURE_FACTORY = new InjectionToken(
    'NgtCommonTexture factory'
);

export function provideCommonTextureFactory<
    TTexture extends THREE.Texture,
    TSubTexture extends NgtCommonTexture<TTexture> = NgtCommonTexture<TTexture>
>(subTextureType: AnyConstructor<TSubTexture>): Provider {
    return [
        provideInstanceFactory<TTexture>(
            subTextureType as unknown as AnyConstructor<NgtInstance<TTexture>>
        ),
        { provide: NgtCommonTexture, useExisting: subTextureType },
        {
            provide: NGT_COMMON_TEXTURE_FACTORY,
            useFactory: (subTexture: TSubTexture) => {
                return () => subTexture.texture;
            },
            deps: [subTextureType],
        },
    ];
}
