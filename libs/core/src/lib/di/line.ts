import { Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtMaterialGeometry } from '../abstracts/material-geometry';
import { NgtCommonLine } from '../three/line';
import { NGT_COMMON_LINE_FACTORY } from '../tokens';
import type { AnyConstructor, AnyFunction } from '../types';
import { provideMaterialGeometryObjectFactory } from './material-geometry';

export function provideCommonLineFactory<
    TLine extends THREE.Line,
    TSubLine extends NgtCommonLine<TLine> = NgtCommonLine<TLine>
>(
    subLineType: AnyConstructor<TSubLine>,
    factory?: (sub: TSubLine) => THREE.Object3D
): Provider {
    return [
        provideMaterialGeometryObjectFactory(
            subLineType as unknown as AnyConstructor<NgtMaterialGeometry>,
            factory as AnyFunction
        ),
        { provide: NgtCommonLine, useExisting: subLineType },
        {
            provide: NGT_COMMON_LINE_FACTORY,
            useFactory: (subLine: TSubLine) => {
                return () => factory?.(subLine) || subLine.instance;
            },
            deps: [subLineType],
        },
    ];
}
