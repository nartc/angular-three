// GENERATED - AngularThree v7.0.0
import { NgtAnyConstructor, NgtCommonCurve, provideCommonCurveRef, provideNgtCommonCurve } from '@angular-three/core';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-quadratic-bezier-curve3',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonCurve(NgtQuadraticBezierCurve3), provideCommonCurveRef(NgtQuadraticBezierCurve3)],
})
export class NgtQuadraticBezierCurve3 extends NgtCommonCurve<THREE.QuadraticBezierCurve3> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.QuadraticBezierCurve3> | undefined;

  override get curveType(): NgtAnyConstructor<THREE.QuadraticBezierCurve3> {
    return THREE.QuadraticBezierCurve3;
  }
}
