import { InjectionToken, Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtObject } from '../abstracts/object';
import { NgtCommonHelper } from '../three/helper';
import type { AnyConstructor } from '../types';
import { provideObjectFactory } from './object';

export const NGT_COMMON_HELPER_FACTORY = new InjectionToken(
    'NgtCommonHelper factory'
);

export function provideCommonHelperFactory<
    THelper extends THREE.Object3D,
    TSubHelper extends NgtCommonHelper<THelper> = NgtCommonHelper<THelper>
>(
    subHelperType: AnyConstructor<TSubHelper>,
    factory?: (sub: TSubHelper) => THREE.Object3D
): Provider {
    return [
        provideObjectFactory(
            subHelperType as unknown as AnyConstructor<NgtObject>
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
