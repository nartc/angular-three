import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import { NgtInstance, NgtInstanceState } from '../abstracts/instance';
import { tapEffect } from '../stores/component-store';
import type { AnyConstructor, NumberInput } from '../types';
import { coerceNumberProperty } from '../utils/coercion';

export interface NgtCommonCurveState<TCurve extends THREE.Curve<THREE.Vector> = THREE.Curve<THREE.Vector>>
  extends NgtInstanceState<TCurve> {
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

  override ngOnInit() {
    super.ngOnInit();
    this.zone.runOutsideAngular(() => {
      this.store.onReady(() => {
        this.init(this.instanceArgs$);
        this.postInit();
      });
    });
  }

  protected override postPrepare(curve: TCurve) {
    const arcLengthDivisions = this.get((s) => s.arcLengthDivisions);
    if (arcLengthDivisions != undefined) {
      curve.arcLengthDivisions = arcLengthDivisions;
    }
  }

  private readonly init = this.effect<unknown[]>(
    tapEffect((instanceArgs) => {
      this.prepareInstance(new this.curveType(...instanceArgs));
    })
  );
}
