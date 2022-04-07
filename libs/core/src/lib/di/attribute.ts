import { InjectionToken, Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtInstance } from '../abstracts/instance';
import { NgtCommonAttribute } from '../three/attribute';
import type { AnyConstructor } from '../types';
import { provideInstanceFactory } from './instance';

export const NGT_COMMON_ATTRIBUTE_FACTORY = new InjectionToken(
    'NgtCommonAttribute factory'
);

export function provideCommonAttributeFactory<
    TAttribute extends THREE.BufferAttribute | THREE.InterleavedBufferAttribute,
    TSubAttribute extends NgtCommonAttribute<TAttribute> = NgtCommonAttribute<TAttribute>
>(subAttributeType: AnyConstructor<TSubAttribute>): Provider {
    return [
        provideInstanceFactory<TAttribute>(
            subAttributeType as unknown as AnyConstructor<
                NgtInstance<TAttribute>
            >
        ),
        { provide: NgtCommonAttribute, useExisting: subAttributeType },
        {
            provide: NGT_COMMON_ATTRIBUTE_FACTORY,
            useFactory: (subAttribute: TSubAttribute) => {
                return () => subAttribute.attribute;
            },
            deps: [subAttributeType],
        },
    ];
}
