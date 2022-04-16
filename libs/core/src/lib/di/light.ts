import { Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtObject } from '../abstracts/object';
import { NgtCommonLight } from '../three/light';
import { NGT_COMMON_LIGHT_FACTORY, NGT_COMMON_LIGHT_REF } from '../tokens';
import type { AnyConstructor, AnyFunction, NgtRef } from '../types';
import { provideObjectFactory, provideObjectRef } from './object';

export function provideCommonLightFactory<
    TLight extends THREE.Light,
    TSubLight extends NgtCommonLight<TLight> = NgtCommonLight<TLight>
>(
    subLightType: AnyConstructor<TSubLight>,
    factory?: (sub: TSubLight) => THREE.Object3D
): Provider {
    return [
        provideObjectFactory(
            subLightType as unknown as AnyConstructor<NgtObject>,
            factory as AnyFunction
        ),
        { provide: NgtCommonLight, useExisting: subLightType },
        {
            provide: NGT_COMMON_LIGHT_FACTORY,
            useFactory: (subLight: TSubLight) => {
                return () => factory?.(subLight) || subLight.instance.value;
            },
            deps: [subLightType],
        },
    ];
}

export function provideCommonLightRef<TType extends AnyConstructor<any>>(
    subLightType: TType,
    factory?: (instance: InstanceType<TType>) => NgtRef
): Provider {
    return [
        provideObjectRef(subLightType, factory),
        { provide: NgtCommonLight, useExisting: subLightType },
        {
            provide: NGT_COMMON_LIGHT_REF,
            useFactory: (instance: InstanceType<TType>) => {
                return factory?.(instance) || instance.instance;
            },
            deps: [subLightType],
        },
    ];
}
