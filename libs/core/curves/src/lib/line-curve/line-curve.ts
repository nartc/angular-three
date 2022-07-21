// GENERATED
import { AnyConstructor, NgtCommonCurve, provideCommonCurveRef } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three/src/Three';

@Component({
  selector: 'ngt-line-curve',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonCurveRef(NgtLineCurve)],
})
export class NgtLineCurve extends NgtCommonCurve<THREE.LineCurve> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.LineCurve> | undefined;

  override get curveType(): AnyConstructor<THREE.LineCurve> {
    return THREE.LineCurve;
  }
}

@NgModule({
  imports: [NgtLineCurve],
  exports: [NgtLineCurve],
})
export class NgtLineCurveModule {}
