import { Provider } from '@angular/core';
import { NgtCommonHelper } from '../three/helper';
import { NGT_COMMON_HELPER_REF } from '../tokens';
import type { AnyConstructor, NgtRef } from '../types';
import { provideObjectRef } from './object';

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
                return () => factory?.(instance) || instance.instance;
            },
            deps: [subHelperType],
        },
    ];
}
