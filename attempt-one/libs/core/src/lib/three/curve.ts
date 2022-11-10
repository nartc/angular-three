import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import {
  NgtInstance,
  NgtInstanceState,
  provideNgtInstance,
} from '../abstracts/instance';
import type {
  AnyConstructor,
  NgtPrepareInstanceFn,
  NumberInput,
} from '../types';
import { coerceNumberProperty } from '../utils/coercion';
import { createNgtProvider } from '../utils/inject';

export interface NgtCommonCurveState<
  TCurve extends THREE.Curve<THREE.Vector> = THREE.Curve<THREE.Vector>
> extends NgtInstanceState<TCurve> {
  arcLengthDivisions?: number;
}

@Directive()
export abstract class NgtCommonCurve<
  TCurve extends THREE.Curve<THREE.Vector> = THREE.Curve<THREE.Vector>
> extends NgtInstance<TCurve, NgtCommonCurveState<TCurve>> {
  abstract get curveType(): AnyConstructor<TCurve>;

  @Input() set args(v: ConstructorParameters<AnyConstructor<TCurve>>) {
    this.instanceArgs = v;
  }

  @Input() set arcLengthDivisions(arcLengthDivisions: NumberInput) {
    this.set({
      arcLengthDivisions: coerceNumberProperty(arcLengthDivisions),
    });
  }

  override initFn(
    prepareInstance: NgtPrepareInstanceFn<TCurve>
  ): (() => void) | void | undefined {
    prepareInstance(new this.curveType(...this.get((s) => s.instanceArgs)));
  }

  override postPrepare(curve: TCurve) {
    const arcLengthDivisions = this.get((s) => s.arcLengthDivisions);
    if (arcLengthDivisions != undefined) {
      curve.arcLengthDivisions = arcLengthDivisions;
    }
  }
}

export const provideNgtCommonCurve = createNgtProvider(
  NgtCommonCurve,
  provideNgtInstance
);
