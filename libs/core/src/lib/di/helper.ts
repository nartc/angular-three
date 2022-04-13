import { Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtObject } from '../abstracts/object';
import { NgtCommonHelper } from '../three/helper';
import { NGT_COMMON_HELPER_FACTORY } from '../tokens';
import type { AnyConstructor, AnyFunction } from '../types';
import { provideObjectFactory } from './object';

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
                return () => factory?.(subHelper) || subHelper.object3d;
            },
            deps: [subHelperType],
        },
    ];
}
