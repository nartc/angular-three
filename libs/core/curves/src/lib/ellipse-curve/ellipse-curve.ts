// GENERATED
import { AnyConstructor, NgtCommonCurve, provideCommonCurveRef } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-ellipse-curve',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonCurveRef(NgtEllipseCurve)],
})
export class NgtEllipseCurve extends NgtCommonCurve<THREE.EllipseCurve> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.EllipseCurve> | undefined;

  override get curveType(): AnyConstructor<THREE.EllipseCurve> {
    return THREE.EllipseCurve;
  }
}

@NgModule({
  imports: [NgtEllipseCurve],
  exports: [NgtEllipseCurve],
})
export class NgtEllipseCurveModule {}
