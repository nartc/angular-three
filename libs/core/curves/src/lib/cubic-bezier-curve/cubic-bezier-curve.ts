// GENERATED
import { AnyConstructor, NgtCommonCurve, provideCommonCurveRef } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-cubic-bezier-curve',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonCurveRef(NgtCubicBezierCurve)],
})
export class NgtCubicBezierCurve extends NgtCommonCurve<THREE.CubicBezierCurve> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.CubicBezierCurve> | undefined;

  override get curveType(): AnyConstructor<THREE.CubicBezierCurve> {
    return THREE.CubicBezierCurve;
  }
}

@NgModule({
  declarations: [NgtCubicBezierCurve],
  exports: [NgtCubicBezierCurve],
})
export class NgtCubicBezierCurveModule {}
