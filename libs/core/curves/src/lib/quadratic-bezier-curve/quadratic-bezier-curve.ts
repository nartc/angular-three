// GENERATED
import { AnyConstructor, NgtCommonCurve, provideCommonCurveRef } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-quadratic-bezier-curve',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonCurveRef(NgtQuadraticBezierCurve)],
})
export class NgtQuadraticBezierCurve extends NgtCommonCurve<THREE.QuadraticBezierCurve> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.QuadraticBezierCurve> | undefined;

  override get curveType(): AnyConstructor<THREE.QuadraticBezierCurve> {
    return THREE.QuadraticBezierCurve;
  }
}

@NgModule({
  declarations: [NgtQuadraticBezierCurve],
  exports: [NgtQuadraticBezierCurve],
})
export class NgtQuadraticBezierCurveModule {}
