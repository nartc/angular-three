// GENERATED - AngularThree v7.0.0
import { NgtAnyConstructor, NgtCommonCurve, provideNgtCommonCurve, provideCommonCurveRef } from '@angular-three/core';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-ellipse-curve',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonCurve(NgtEllipseCurve), provideCommonCurveRef(NgtEllipseCurve)],
})
export class NgtEllipseCurve extends NgtCommonCurve<THREE.EllipseCurve> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.EllipseCurve> | undefined;

  override get curveType(): NgtAnyConstructor<THREE.EllipseCurve> {
    return THREE.EllipseCurve;
  }
}
