import { Provider } from '@angular/core';
import { NgtCommonLight } from '../three/light';
import { NGT_COMMON_LIGHT_REF } from '../tokens';
import type { AnyConstructor, NgtRef } from '../types';
import { provideObjectRef } from './object';

export function provideCommonLightRef<TType extends AnyConstructor<any>>(
    subLightType: TType,
    factory?: (instance: InstanceType<TType>) => NgtRef
): Provider {
    return [
        provideObjectRef(subLightType, factory),
        { provide: NgtCommonLight, useExisting: subLightType },
        {
            provide: NGT_COMMON_LIGHT_REF,
            useFactory: (instance: InstanceType<TType>) => {
                return () => factory?.(instance) || instance.instance;
            },
            deps: [subLightType],
        },
    ];
}
