import { InjectionToken, Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtInstance } from '../abstracts/instance';
import { NgtCommonCurve } from '../three/curve';
import type { AnyConstructor } from '../types';
import { provideInstanceFactory } from './instance';

export const NGT_COMMON_CURVE_FACTORY = new InjectionToken(
    'NgtCommonCurve factory'
);

export function provideCommonCurveFactory<
    TCurve extends THREE.Curve<THREE.Vector>,
    TSubCurve extends NgtCommonCurve<TCurve> = NgtCommonCurve<TCurve>
>(
    subCurveType: AnyConstructor<TSubCurve>,
    factory?: (sub: TSubCurve) => TCurve
): Provider {
    return [
        provideInstanceFactory<TCurve>(
            subCurveType as unknown as AnyConstructor<NgtInstance<TCurve>>
        ),
        { provide: NgtCommonCurve, useExisting: subCurveType },
        {
            provide: NGT_COMMON_CURVE_FACTORY,
            useFactory: (subCurve: TSubCurve) => {
                return () => factory?.(subCurve) || subCurve.curve;
            },
            deps: [subCurveType],
        },
    ];
}
