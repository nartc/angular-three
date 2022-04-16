import { Provider } from '@angular/core';
import { NgtCommonLine } from '../three/line';
import { NGT_COMMON_LINE_REF } from '../tokens';
import type { AnyConstructor, NgtRef } from '../types';
import { provideMaterialGeometryObjectRef } from './material-geometry';

export function provideCommonLineRef<TType extends AnyConstructor<any>>(
    subLineType: TType,
    factory?: (instance: InstanceType<TType>) => NgtRef
): Provider {
    return [
        provideMaterialGeometryObjectRef(subLineType, factory),
        { provide: NgtCommonLine, useExisting: subLineType },
        {
            provide: NGT_COMMON_LINE_REF,
            useFactory: (instance: InstanceType<TType>) => {
                return () => factory?.(instance) || instance.instance;
            },
            deps: [subLineType],
        },
    ];
}
