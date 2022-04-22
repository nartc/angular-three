import { Provider } from '@angular/core';
import { Ref } from '../ref';
import { NgtCommonCurve } from '../three/curve';
import { NGT_COMMON_CURVE_REF } from '../tokens';
import type { AnyConstructor } from '../types';
import { provideInstanceRef } from './instance';

export function provideCommonCurveRef<TType extends AnyConstructor<any>>(
    subCurveType: TType,
    factory?: (instance: InstanceType<TType>) => Ref
): Provider {
    return [
        provideInstanceRef(subCurveType, factory),
        { provide: NgtCommonCurve, useExisting: subCurveType },
        {
            provide: NGT_COMMON_CURVE_REF,
            useFactory: (instance: InstanceType<TType>) => {
                return () => factory?.(instance) || instance.instance;
            },
            deps: [subCurveType],
        },
    ];
}
