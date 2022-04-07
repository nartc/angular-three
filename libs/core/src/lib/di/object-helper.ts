import { InjectionToken, Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtInstance } from '../abstracts/instance';
import { NgtCommonObjectHelper } from '../three/object-helper';
import type { AnyConstructor } from '../types';
import { provideInstanceFactory } from './instance';

export const NGT_COMMON_OBJECT_HELPER_FACTORY = new InjectionToken(
    'NgtCommonObjectHelper factory'
);

export function provideCommonObjectHelperFactory<
    TObjectHelper extends THREE.Object3D,
    TSubObjectHelper extends NgtCommonObjectHelper<TObjectHelper> = NgtCommonObjectHelper<TObjectHelper>
>(subObjectHelperType: AnyConstructor<TSubObjectHelper>): Provider {
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
                return () => subObjectHelper.objectHelper;
            },
            deps: [subObjectHelperType],
        },
    ];
}
