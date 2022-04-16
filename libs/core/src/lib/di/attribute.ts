import { Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtInstance } from '../abstracts/instance';
import { NgtCommonAttribute } from '../three/attribute';
import {
    NGT_COMMON_ATTRIBUTE_FACTORY,
    NGT_COMMON_ATTRIBUTE_REF,
} from '../tokens';
import type { AnyConstructor, AnyFunction, NgtRef } from '../types';
import { provideInstanceFactory, provideInstanceRef } from './instance';

export function provideCommonAttributeFactory<
    TAttribute extends THREE.BufferAttribute | THREE.InterleavedBufferAttribute,
    TSubAttribute extends NgtCommonAttribute<TAttribute> = NgtCommonAttribute<TAttribute>
>(
    subAttributeType: AnyConstructor<TSubAttribute>,
    factory?: (sub: TSubAttribute) => TAttribute
): Provider {
    return [
        provideInstanceFactory<TAttribute>(
            subAttributeType as unknown as AnyConstructor<
                NgtInstance<TAttribute>
            >,
            factory as AnyFunction
        ),
        { provide: NgtCommonAttribute, useExisting: subAttributeType },
        {
            provide: NGT_COMMON_ATTRIBUTE_FACTORY,
            useFactory: (subAttribute: TSubAttribute) => {
                return () =>
                    factory?.(subAttribute) || subAttribute.instance.value;
            },
            deps: [subAttributeType],
        },
    ];
}

export function provideCommonAttributeRef<TType extends AnyConstructor<any>>(
    subAttributeType: TType,
    factory?: (
        instance: InstanceType<TType>
    ) => NgtRef<THREE.BufferAttribute | THREE.InterleavedBufferAttribute>
): Provider {
    return [
        provideInstanceRef(subAttributeType, factory),
        { provide: NgtCommonAttribute, useExisting: subAttributeType },
        {
            provide: NGT_COMMON_ATTRIBUTE_REF,
            useFactory: (instance: InstanceType<TType>) => {
                return factory?.(instance) || instance.instance;
            },
            deps: [subAttributeType],
        },
    ];
}
