// GENERATED - AngularThree v7.0.0
import { NgtAnyConstructor, NgtCommonCurve, provideNgtCommonCurve, provideCommonCurveRef } from '@angular-three/core';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-line-curve',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonCurve(NgtLineCurve), provideCommonCurveRef(NgtLineCurve)],
})
export class NgtLineCurve extends NgtCommonCurve<THREE.LineCurve> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.LineCurve> | undefined;

  override get curveType(): NgtAnyConstructor<THREE.LineCurve> {
    return THREE.LineCurve;
  }
}
