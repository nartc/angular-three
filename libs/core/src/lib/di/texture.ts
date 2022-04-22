import { Provider } from '@angular/core';
import { Ref } from '../ref';
import { NgtCommonTexture } from '../three/texture';
import { NGT_COMMON_TEXTURE_REF } from '../tokens';
import type { AnyConstructor } from '../types';
import { provideInstanceRef } from './instance';

export function provideCommonTextureRef<TType extends AnyConstructor<any>>(
    subTextureType: TType,
    factory?: (instance: InstanceType<TType>) => Ref
): Provider {
    return [
        provideInstanceRef(subTextureType, factory),
        { provide: NgtCommonTexture, useExisting: subTextureType },
        {
            provide: NGT_COMMON_TEXTURE_REF,
            useFactory: (instance: InstanceType<TType>) => {
                return () => factory?.(instance) || instance.instance;
            },
            deps: [subTextureType],
        },
    ];
}
