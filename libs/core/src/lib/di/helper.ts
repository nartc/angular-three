import { Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtObject } from '../abstracts/object';
import { NgtCommonHelper } from '../three/helper';
import { NGT_COMMON_HELPER_FACTORY, NGT_COMMON_HELPER_REF } from '../tokens';
import type { AnyConstructor, AnyFunction, NgtRef } from '../types';
import { provideObjectFactory, provideObjectRef } from './object';

export function provideCommonHelperFactory<
    THelper extends THREE.Object3D,
    TSubHelper extends NgtCommonHelper<THelper> = NgtCommonHelper<THelper>
>(
    subHelperType: AnyConstructor<TSubHelper>,
    factory?: (sub: TSubHelper) => THREE.Object3D
): Provider {
    return [
        provideObjectFactory(
            subHelperType as unknown as AnyConstructor<NgtObject>,
            factory as AnyFunction
        ),
        { provide: NgtCommonHelper, useExisting: subHelperType },
        {
            provide: NGT_COMMON_HELPER_FACTORY,
            useFactory: (subHelper: TSubHelper) => {
                return () => factory?.(subHelper) || subHelper.instance.value;
            },
            deps: [subHelperType],
        },
    ];
}

export function provideCommonHelperRef<TType extends AnyConstructor<any>>(
    subHelperType: TType,
    factory?: (instance: InstanceType<TType>) => NgtRef
): Provider {
    return [
        provideObjectRef(subHelperType, factory),
        { provide: NgtCommonHelper, useExisting: subHelperType },
        {
            provide: NGT_COMMON_HELPER_REF,
            useFactory: (instance: InstanceType<TType>) => {
                return factory?.(instance) || instance.instance;
            },
            deps: [subHelperType],
        },
    ];
}
