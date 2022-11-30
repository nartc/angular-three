// GENERATED - AngularThree v7.0.0
import { NgtAnyConstructor, NgtCommonCurve, provideCommonCurveRef, provideNgtCommonCurve } from '@angular-three/core';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-cubic-bezier-curve3',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonCurve(NgtCubicBezierCurve3), provideCommonCurveRef(NgtCubicBezierCurve3)],
})
export class NgtCubicBezierCurve3 extends NgtCommonCurve<THREE.CubicBezierCurve3> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.CubicBezierCurve3> | undefined;

  override get curveType(): NgtAnyConstructor<THREE.CubicBezierCurve3> {
    return THREE.CubicBezierCurve3;
  }
}
