import { Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtObject } from '../abstracts/object';
import { NgtCommonSprite } from '../three/sprite';
import { NGT_COMMON_SPRITE_FACTORY, NGT_COMMON_SPRITE_REF } from '../tokens';
import type { AnyConstructor, AnyFunction, NgtRef } from '../types';
import { provideObjectFactory, provideObjectRef } from './object';

export function provideCommonSpriteFactory<
    TSprite extends THREE.Sprite,
    TSubSprite extends NgtCommonSprite<TSprite> = NgtCommonSprite<TSprite>
>(
    subSpriteType: AnyConstructor<TSubSprite>,
    factory?: (sub: TSubSprite) => THREE.Object3D
): Provider {
    return [
        provideObjectFactory(
            subSpriteType as unknown as AnyConstructor<NgtObject>,
            factory as AnyFunction
        ),
        { provide: NgtCommonSprite, useExisting: subSpriteType },
        {
            provide: NGT_COMMON_SPRITE_FACTORY,
            useFactory: (subSprite: TSubSprite) => {
                return () => factory?.(subSprite) || subSprite.instance.value;
            },
            deps: [subSpriteType],
        },
    ];
}

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
                return factory?.(instance) || instance.instance;
            },
            deps: [subSpriteType],
        },
    ];
}
