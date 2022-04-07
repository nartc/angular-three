import { InjectionToken, Provider } from '@angular/core';
import { NgtObject } from '../abstracts/object';
import { NgtCommonSprite } from '../three/sprite';
import type { AnyConstructor } from '../types';
import { provideObjectFactory } from './object';

export const NGT_COMMON_SPRITE_FACTORY = new InjectionToken(
    'NgtCommonSprite factory'
);

export function provideCommonSpriteFactory<TSubSprite extends NgtCommonSprite>(
    subSpriteType: AnyConstructor<TSubSprite>
): Provider {
    return [
        provideObjectFactory(
            subSpriteType as unknown as AnyConstructor<NgtObject>
        ),
        { provide: NgtCommonSprite, useExisting: subSpriteType },
        {
            provide: NGT_COMMON_SPRITE_FACTORY,
            useFactory: (subSprite: TSubSprite) => {
                return () => subSprite.object;
            },
            deps: [subSpriteType],
        },
    ];
}
