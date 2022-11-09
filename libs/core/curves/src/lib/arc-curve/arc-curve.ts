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
  selector: 'ngt-arc-curve',
  standalone: true,
  template: '<ng-content></ng-content>',

  providers: [
    provideNgtCommonCurve(NgtArcCurve),
    provideCommonCurveRef(NgtArcCurve),
  ],
})
export class NgtArcCurve extends NgtCommonCurve<THREE.ArcCurve> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.ArcCurve>
    | undefined;

  override get curveType(): AnyConstructor<THREE.ArcCurve> {
    return THREE.ArcCurve;
  }
}
