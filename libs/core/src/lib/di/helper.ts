import { Provider } from '@angular/core';
import { Ref } from '../ref';
import { NgtCommonHelper } from '../three/helper';
import { NGT_COMMON_HELPER_REF } from '../tokens';
import type { AnyConstructor } from '../types';
import { provideObjectRef } from './object';

export function provideCommonHelperRef<TType extends AnyConstructor<any>>(
    subHelperType: TType,
    factory?: (instance: InstanceType<TType>) => Ref
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
