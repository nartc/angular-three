import { Provider } from '@angular/core';
import { NgtCommonSprite } from '../three/sprite';
import { NGT_COMMON_SPRITE_REF } from '../tokens';
import type { AnyConstructor, NgtRef } from '../types';
import { provideObjectRef } from './object';

export function provideCommonSpriteRef<TType extends AnyConstructor<any>>(
    subSpriteType: TType,
    factory?: (instance: InstanceType<TType>) => NgtRef
): Provider {
    return [
        provideObjectRef(subSpriteType, factory),
        { provide: NgtCommonSprite, useExisting: subSpriteType },
        {
            provide: NGT_COMMON_SPRITE_REF,
            useFactory: (instance: InstanceType<TType>) => {
                return () => factory?.(instance) || instance.instance;
            },
            deps: [subSpriteType],
        },
    ];
}
