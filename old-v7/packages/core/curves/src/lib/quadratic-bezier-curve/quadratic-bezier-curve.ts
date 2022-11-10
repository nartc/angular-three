// GENERATED - AngularThree v7.0.0
import { NgtAnyConstructor, NgtCommonCurve, provideNgtCommonCurve, provideCommonCurveRef } from '@angular-three/core';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-quadratic-bezier-curve',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonCurve(NgtQuadraticBezierCurve), provideCommonCurveRef(NgtQuadraticBezierCurve)],
})
export class NgtQuadraticBezierCurve extends NgtCommonCurve<THREE.QuadraticBezierCurve> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.QuadraticBezierCurve> | undefined;

  override get curveType(): NgtAnyConstructor<THREE.QuadraticBezierCurve> {
    return THREE.QuadraticBezierCurve;
  }
}
