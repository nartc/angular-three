import { Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtInstance } from '../abstracts/instance';
import { NgtCommonCurve } from '../three/curve';
import { NGT_COMMON_CURVE_FACTORY, NGT_COMMON_CURVE_REF } from '../tokens';
import type { AnyConstructor, AnyFunction, NgtRef } from '../types';
import { provideInstanceFactory, provideInstanceRef } from './instance';

export function provideCommonCurveFactory<
    TCurve extends THREE.Curve<THREE.Vector>,
    TSubCurve extends NgtCommonCurve<TCurve> = NgtCommonCurve<TCurve>
>(
    subCurveType: AnyConstructor<TSubCurve>,
    factory?: (sub: TSubCurve) => TCurve
): Provider {
    return [
        provideInstanceFactory<TCurve>(
            subCurveType as unknown as AnyConstructor<NgtInstance<TCurve>>,
            factory as AnyFunction
        ),
        { provide: NgtCommonCurve, useExisting: subCurveType },
        {
            provide: NGT_COMMON_CURVE_FACTORY,
            useFactory: (subCurve: TSubCurve) => {
                return () => factory?.(subCurve) || subCurve.instance.value;
            },
            deps: [subCurveType],
        },
    ];
}

export function provideCommonCurveRef<TType extends AnyConstructor<any>>(
    subCurveType: TType,
    factory?: (instance: InstanceType<TType>) => NgtRef
): Provider {
    return [
        provideInstanceRef(subCurveType, factory),
        { provide: NgtCommonCurve, useExisting: subCurveType },
        {
            provide: NGT_COMMON_CURVE_REF,
            useFactory: (instance: InstanceType<TType>) => {
                return factory?.(instance) || instance.instance;
            },
            deps: [subCurveType],
        },
    ];
}
