import { InjectionToken, Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtMaterialGeometry } from '../abstracts/material-geometry';
import { NgtCommonLine } from '../three/line';
import type { AnyConstructor, AnyFunction } from '../types';
import { provideMaterialGeometryObjectFactory } from './material-geometry';

export const NGT_COMMON_LINE_FACTORY = new InjectionToken<AnyFunction>(
    'NgtCommonLine factory'
);

export function provideCommonLineFactory<TSubLine extends NgtCommonLine>(
    subLineType: AnyConstructor<TSubLine>,
    factory?: (sub: TSubLine) => THREE.Object3D
): Provider {
    return [
        provideMaterialGeometryObjectFactory(
            subLineType as unknown as AnyConstructor<NgtMaterialGeometry>
        ),
        { provide: NgtCommonLine, useExisting: subLineType },
        {
            provide: NGT_COMMON_LINE_FACTORY,
            useFactory: (subLine: TSubLine) => {
                return () => factory?.(subLine) || subLine.object3d;
            },
            deps: [subLineType],
        },
    ];
}
