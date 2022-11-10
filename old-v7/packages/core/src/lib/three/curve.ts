import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import { NgtInstance, NgtInstanceState, provideNgtInstance } from '../abstracts/instance';
import type { NgtAnyConstructor, NgtNumberInput, NgtPrepareInstanceFn } from '../types';
import { coerceNumber } from '../utils/coercion';
import { createNgtProvider } from '../utils/inject';

export interface NgtCommonCurveState<TCurve extends THREE.Curve<THREE.Vector> = THREE.Curve<THREE.Vector>>
  extends NgtInstanceState<TCurve> {
  arcLengthDivisions?: number;
}

@Directive()
export abstract class NgtCommonCurve<
  TCurve extends THREE.Curve<THREE.Vector> = THREE.Curve<THREE.Vector>
> extends NgtInstance<TCurve, NgtCommonCurveState<TCurve>> {
  abstract get curveType(): NgtAnyConstructor<TCurve>;

  @Input() set args(v: ConstructorParameters<NgtAnyConstructor<TCurve>>) {
    this.instanceArgs = v;
  }

  @Input() set arcLengthDivisions(arcLengthDivisions: NgtNumberInput) {
    this.set({
      arcLengthDivisions: coerceNumber(arcLengthDivisions),
    });
  }

  override initFn(prepareInstance: NgtPrepareInstanceFn<TCurve>): (() => void) | void | undefined {
    prepareInstance(new this.curveType(...this.initInstanceArgs(this.instanceArgs)));
  }

  override postInit() {
    super.postInit();
    const arcLengthDivisions = this.getState((s) => s.arcLengthDivisions);
    if (arcLengthDivisions != undefined) {
      this.instanceValue.arcLengthDivisions = arcLengthDivisions;
    }
  }
}

export const provideNgtCommonCurve = createNgtProvider(NgtCommonCurve, provideNgtInstance);
