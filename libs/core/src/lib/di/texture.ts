import { Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtInstance } from '../abstracts/instance';
import { NgtCommonTexture } from '../three/texture';
import { NGT_COMMON_TEXTURE_FACTORY } from '../tokens';
import type { AnyConstructor } from '../types';
import { provideInstanceFactory } from './instance';

export function provideCommonTextureFactory<
    TTexture extends THREE.Texture,
    TSubTexture extends NgtCommonTexture<TTexture> = NgtCommonTexture<TTexture>
>(
    subTextureType: AnyConstructor<TSubTexture>,
    factory?: (sub: TSubTexture) => TTexture
): Provider {
    return [
        provideInstanceFactory<TTexture>(
            subTextureType as unknown as AnyConstructor<NgtInstance<TTexture>>
        ),
        { provide: NgtCommonTexture, useExisting: subTextureType },
        {
            provide: NGT_COMMON_TEXTURE_FACTORY,
            useFactory: (subTexture: TSubTexture) => {
                return () => factory?.(subTexture) || subTexture.texture;
            },
            deps: [subTextureType],
        },
    ];
}
