// GENERATED - AngularThree v7.0.0
import { NgtAnyConstructor, NgtCommonCurve, provideCommonCurveRef, provideNgtCommonCurve } from '@angular-three/core';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-line-curve3',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonCurve(NgtLineCurve3), provideCommonCurveRef(NgtLineCurve3)],
})
export class NgtLineCurve3 extends NgtCommonCurve<THREE.LineCurve3> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.LineCurve3> | undefined;

  override get curveType(): NgtAnyConstructor<THREE.LineCurve3> {
    return THREE.LineCurve3;
  }
}
