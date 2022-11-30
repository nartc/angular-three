// GENERATED - AngularThree v7.0.0
import { NgtAnyConstructor, NgtCommonCurve, provideCommonCurveRef, provideNgtCommonCurve } from '@angular-three/core';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-arc-curve',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonCurve(NgtArcCurve), provideCommonCurveRef(NgtArcCurve)],
})
export class NgtArcCurve extends NgtCommonCurve<THREE.ArcCurve> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.ArcCurve> | undefined;

  override get curveType(): NgtAnyConstructor<THREE.ArcCurve> {
    return THREE.ArcCurve;
  }
}
