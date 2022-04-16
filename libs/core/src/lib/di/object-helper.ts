import { Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtInstance } from '../abstracts/instance';
import { NgtCommonObjectHelper } from '../three/object-helper';
import {
    NGT_COMMON_OBJECT_HELPER_FACTORY,
    NGT_COMMON_OBJECT_HELPER_REF,
} from '../tokens';
import type { AnyConstructor, AnyFunction, NgtRef } from '../types';
import { provideInstanceFactory, provideInstanceRef } from './instance';

export function provideCommonObjectHelperFactory<
    TObjectHelper extends THREE.Object3D,
    TSubObjectHelper extends NgtCommonObjectHelper<TObjectHelper> = NgtCommonObjectHelper<TObjectHelper>
>(
    subObjectHelperType: AnyConstructor<TSubObjectHelper>,
    factory?: (sub: TSubObjectHelper) => TObjectHelper
): Provider {
    return [
        provideInstanceFactory<TObjectHelper>(
            subObjectHelperType as unknown as AnyConstructor<
                NgtInstance<TObjectHelper>
            >,
            factory as AnyFunction
        ),
        { provide: NgtCommonObjectHelper, useExisting: subObjectHelperType },
        {
            provide: NGT_COMMON_OBJECT_HELPER_FACTORY,
            useFactory: (subObjectHelper: TSubObjectHelper) => {
                return () =>
                    factory?.(subObjectHelper) ||
                    subObjectHelper.instance.value;
            },
            deps: [subObjectHelperType],
        },
    ];
}

export function provideCommonObjectHelperRef<TType extends AnyConstructor<any>>(
    subObjectHelperType: TType,
    factory?: (instance: InstanceType<TType>) => NgtRef
): Provider {
    return [
        provideInstanceRef(subObjectHelperType, factory),
        { provide: NgtCommonObjectHelper, useExisting: subObjectHelperType },
        {
            provide: NGT_COMMON_OBJECT_HELPER_REF,
            useFactory: (instance: InstanceType<TType>) => {
                return factory?.(instance) || instance.instance;
            },
            deps: [subObjectHelperType],
        },
    ];
}
