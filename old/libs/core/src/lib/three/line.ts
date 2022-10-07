import { Directive } from '@angular/core';
import * as THREE from 'three';
import { NgtMaterialGeometry } from '../abstracts/material-geometry';
import { provideNgtObject } from '../abstracts/object';
import { AnyConstructor } from '../types';
import { createNgtProvider } from '../utils/inject';

@Directive()
export abstract class NgtCommonLine<TLine extends THREE.Line = THREE.Line> extends NgtMaterialGeometry<TLine> {
  abstract get lineType(): AnyConstructor<TLine>;

  override get objectType(): AnyConstructor<TLine> {
    return this.lineType;
  }
}

export const provideNgtCommonLine = createNgtProvider(NgtCommonLine, provideNgtObject);
