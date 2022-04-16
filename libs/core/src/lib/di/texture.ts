import { Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtInstance } from '../abstracts/instance';
import { NgtCommonTexture } from '../three/texture';
import { NGT_COMMON_TEXTURE_FACTORY, NGT_COMMON_TEXTURE_REF } from '../tokens';
import type { AnyConstructor, AnyFunction, NgtRef } from '../types';
import { provideInstanceFactory, provideInstanceRef } from './instance';

export function provideCommonTextureFactory<
    TTexture extends THREE.Texture,
    TSubTexture extends NgtCommonTexture<TTexture> = NgtCommonTexture<TTexture>
>(
    subTextureType: AnyConstructor<TSubTexture>,
    factory?: (sub: TSubTexture) => TTexture
): Provider {
    return [
        provideInstanceFactory<TTexture>(
            subTextureType as unknown as AnyConstructor<NgtInstance<TTexture>>,
            factory as AnyFunction
        ),
        { provide: NgtCommonTexture, useExisting: subTextureType },
        {
            provide: NGT_COMMON_TEXTURE_FACTORY,
            useFactory: (subTexture: TSubTexture) => {
                return () => factory?.(subTexture) || subTexture.instance.value;
            },
            deps: [subTextureType],
        },
    ];
}

export function provideCommonTextureRef<TType extends AnyConstructor<any>>(
    subTextureType: TType,
    factory?: (instance: InstanceType<TType>) => NgtRef
): Provider {
    return [
        provideInstanceRef(subTextureType, factory),
        { provide: NgtCommonTexture, useExisting: subTextureType },
        {
            provide: NGT_COMMON_TEXTURE_REF,
            useFactory: (instance: InstanceType<TType>) => {
                return factory?.(instance) || instance.instance;
            },
            deps: [subTextureType],
        },
    ];
}
