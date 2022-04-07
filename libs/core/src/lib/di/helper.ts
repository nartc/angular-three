import { InjectionToken, Provider } from '@angular/core';
import { NgtObject } from '../abstracts/object';
import { NgtCommonHelper } from '../three/helper';
import type { AnyConstructor } from '../types';
import { provideObjectFactory } from './object';

export const NGT_COMMON_HELPER_FACTORY = new InjectionToken(
    'NgtCommonHelper factory'
);

export function provideCommonHelperFactory<TSubHelper extends NgtCommonHelper>(
    subHelperType: AnyConstructor<TSubHelper>
): Provider {
    return [
        provideObjectFactory(
            subHelperType as unknown as AnyConstructor<NgtObject>
        ),
        { provide: NgtCommonHelper, useExisting: subHelperType },
        {
            provide: NGT_COMMON_HELPER_FACTORY,
            useFactory: (subHelper: TSubHelper) => {
                return () => subHelper.object3d;
            },
            deps: [subHelperType],
        },
    ];
}
