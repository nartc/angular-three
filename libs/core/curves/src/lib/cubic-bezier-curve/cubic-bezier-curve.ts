// GENERATED
import {
  AnyConstructor,
  NgtCommonCurve,
  provideNgtCommonCurve,
  provideCommonCurveRef,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-cubic-bezier-curve',
  standalone: true,
  template: '<ng-content></ng-content>',

  providers: [
    provideNgtCommonCurve(NgtCubicBezierCurve),
    provideCommonCurveRef(NgtCubicBezierCurve),
  ],
})
export class NgtCubicBezierCurve extends NgtCommonCurve<THREE.CubicBezierCurve> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.CubicBezierCurve>
    | undefined;

  override get curveType(): AnyConstructor<THREE.CubicBezierCurve> {
    return THREE.CubicBezierCurve;
  }
}
