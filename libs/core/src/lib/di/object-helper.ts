import { Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtInstance } from '../abstracts/instance';
import { NgtCommonObjectHelper } from '../three/object-helper';
import { NGT_COMMON_OBJECT_HELPER_FACTORY } from '../tokens';
import type { AnyConstructor } from '../types';
import { provideInstanceFactory } from './instance';

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
            >
        ),
        { provide: NgtCommonObjectHelper, useExisting: subObjectHelperType },
        {
            provide: NGT_COMMON_OBJECT_HELPER_FACTORY,
            useFactory: (subObjectHelper: TSubObjectHelper) => {
                return () =>
                    factory?.(subObjectHelper) || subObjectHelper.objectHelper;
            },
            deps: [subObjectHelperType],
        },
    ];
}
