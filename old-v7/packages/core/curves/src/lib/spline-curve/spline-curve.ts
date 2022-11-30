// GENERATED - AngularThree v7.0.0
import { NgtAnyConstructor, NgtCommonCurve, provideCommonCurveRef, provideNgtCommonCurve } from '@angular-three/core';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-spline-curve',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonCurve(NgtSplineCurve), provideCommonCurveRef(NgtSplineCurve)],
})
export class NgtSplineCurve extends NgtCommonCurve<THREE.SplineCurve> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.SplineCurve> | undefined;

  override get curveType(): NgtAnyConstructor<THREE.SplineCurve> {
    return THREE.SplineCurve;
  }
}
