import { Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtInstance } from '../abstracts/instance';
import { NgtCommonGeometry } from '../three/geometry';
import {
    NGT_COMMON_GEOMETRY_FACTORY,
    NGT_COMMON_GEOMETRY_REF,
} from '../tokens';
import { AnyConstructor, AnyFunction, NgtRef } from '../types';
import { provideInstanceFactory, provideInstanceRef } from './instance';

export function provideCommonGeometryFactory<
    TGeometry extends THREE.BufferGeometry,
    TSubGeometry extends NgtCommonGeometry<TGeometry> = NgtCommonGeometry<TGeometry>
>(
    subGeometryType: AnyConstructor<TSubGeometry>,
    factory?: (sub: TSubGeometry) => TGeometry
): Provider {
    return [
        provideInstanceFactory<TGeometry>(
            subGeometryType as unknown as AnyConstructor<
                NgtInstance<TGeometry>
            >,
            factory as AnyFunction
        ),
        { provide: NgtCommonGeometry, useExisting: subGeometryType },
        {
            provide: NGT_COMMON_GEOMETRY_FACTORY,
            useFactory: (subGeometry: TSubGeometry) => {
                return () =>
                    factory?.(subGeometry) || subGeometry.instance.value;
            },
            deps: [subGeometryType],
        },
    ];
}

export function provideCommonGeometryRef<TType extends AnyConstructor<any>>(
    subGeometryType: TType,
    factory?: (instance: InstanceType<TType>) => NgtRef
): Provider {
    return [
        provideInstanceRef(subGeometryType, factory),
        { provide: NgtCommonGeometry, useExisting: subGeometryType },
        {
            provide: NGT_COMMON_GEOMETRY_REF,
            useFactory: (instance: InstanceType<TType>) => {
                return factory?.(instance) || instance.instance;
            },
            deps: [subGeometryType],
        },
    ];
}
