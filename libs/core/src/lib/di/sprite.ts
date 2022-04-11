import { Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtObject } from '../abstracts/object';
import { NgtCommonSprite } from '../three/sprite';
import { NGT_COMMON_SPRITE_FACTORY } from '../tokens';
import type { AnyConstructor } from '../types';
import { provideObjectFactory } from './object';

export function provideCommonSpriteFactory<
    TSprite extends THREE.Sprite,
    TSubSprite extends NgtCommonSprite<TSprite> = NgtCommonSprite<TSprite>
>(
    subSpriteType: AnyConstructor<TSubSprite>,
    factory?: (sub: TSubSprite) => THREE.Object3D
): Provider {
    return [
        provideObjectFactory(
            subSpriteType as unknown as AnyConstructor<NgtObject>
        ),
        { provide: NgtCommonSprite, useExisting: subSpriteType },
        {
            provide: NGT_COMMON_SPRITE_FACTORY,
            useFactory: (subSprite: TSubSprite) => {
                return () => factory?.(subSprite) || subSprite.object3d;
            },
            deps: [subSpriteType],
        },
    ];
}
