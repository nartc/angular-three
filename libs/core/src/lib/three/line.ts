import { Directive } from '@angular/core';
import * as THREE from 'three';
import { NgtMaterialGeometry } from '../abstracts/material-geometry';
import { AnyConstructor } from '../types';

@Directive()
export abstract class NgtCommonLine<
    TLine extends THREE.Line = THREE.Line
> extends NgtMaterialGeometry<TLine> {
    abstract get lineType(): AnyConstructor<TLine>;

    override get objectType(): AnyConstructor<TLine> {
        return this.lineType;
    }
}
