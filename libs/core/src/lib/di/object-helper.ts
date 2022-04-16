import { Provider } from '@angular/core';
import { NgtCommonObjectHelper } from '../three/object-helper';
import { NGT_COMMON_OBJECT_HELPER_REF } from '../tokens';
import type { AnyConstructor, NgtRef } from '../types';
import { provideInstanceRef } from './instance';

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
                return () => factory?.(instance) || instance.instance;
            },
            deps: [subObjectHelperType],
        },
    ];
}
