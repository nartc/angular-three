import { Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtCommonAttribute } from '../three/attribute';
import { NGT_COMMON_ATTRIBUTE_REF } from '../tokens';
import type { AnyConstructor, NgtRef } from '../types';
import { provideInstanceRef } from './instance';

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
                return () => factory?.(instance) || instance.instance;
            },
            deps: [subAttributeType],
        },
    ];
}
