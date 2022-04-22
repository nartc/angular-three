import { Provider } from '@angular/core';
import { Ref } from '../ref';
import { NgtCommonGeometry } from '../three/geometry';
import { NGT_COMMON_GEOMETRY_REF } from '../tokens';
import { AnyConstructor } from '../types';
import { provideInstanceRef } from './instance';

export function provideCommonGeometryRef<TType extends AnyConstructor<any>>(
    subGeometryType: TType,
    factory?: (instance: InstanceType<TType>) => Ref
): Provider {
    return [
        provideInstanceRef(subGeometryType, factory),
        { provide: NgtCommonGeometry, useExisting: subGeometryType },
        {
            provide: NGT_COMMON_GEOMETRY_REF,
            useFactory: (instance: InstanceType<TType>) => {
                return () => factory?.(instance) || instance.instance;
            },
            deps: [subGeometryType],
        },
    ];
}
