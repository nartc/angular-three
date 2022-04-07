import { InjectionToken, Provider } from '@angular/core';
import { NgtMaterialGeometry } from '../abstracts/material-geometry';
import { NgtCommonLine } from '../three/line';
import type { AnyConstructor, AnyFunction } from '../types';
import { provideMaterialGeometryObjectFactory } from './material-geometry';

export const NGT_COMMON_LINE_FACTORY = new InjectionToken<AnyFunction>(
    'NgtCommonLine factory'
);

export function provideCommonLineFactory<TSubLine extends NgtCommonLine>(
    subLineType: AnyConstructor<TSubLine>
): Provider {
    return [
        provideMaterialGeometryObjectFactory(
            subLineType as unknown as AnyConstructor<NgtMaterialGeometry>
        ),
        { provide: NgtCommonLine, useExisting: subLineType },
        {
            provide: NGT_COMMON_LINE_FACTORY,
            useFactory: (subLine: TSubLine) => {
                return () => subLine.object3d;
            },
            deps: [subLineType],
        },
    ];
}
