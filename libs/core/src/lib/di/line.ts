import { Provider } from '@angular/core';
import * as THREE from 'three';
import { NgtMaterialGeometry } from '../abstracts/material-geometry';
import { NgtCommonLine } from '../three/line';
import { NGT_COMMON_LINE_FACTORY, NGT_COMMON_LINE_REF } from '../tokens';
import type { AnyConstructor, AnyFunction, NgtRef } from '../types';
import {
    provideMaterialGeometryObjectFactory,
    provideMaterialGeometryObjectRef,
} from './material-geometry';

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
                return () => factory?.(subLine) || subLine.instance.value;
            },
            deps: [subLineType],
        },
    ];
}

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
                return factory?.(instance) || instance.instance;
            },
            deps: [subLineType],
        },
    ];
}
