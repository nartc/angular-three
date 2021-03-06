// GENERATED
import { AnyConstructor, NgtCommonCurve, provideNgtCommonCurve, provideCommonCurveRef } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-catmull-rom-curve3',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgtCommonCurve(NgtCatmullRomCurve3), provideCommonCurveRef(NgtCatmullRomCurve3)],
})
export class NgtCatmullRomCurve3 extends NgtCommonCurve<THREE.CatmullRomCurve3> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.CatmullRomCurve3> | undefined;

  override get curveType(): AnyConstructor<THREE.CatmullRomCurve3> {
    return THREE.CatmullRomCurve3;
  }
}

@NgModule({
  imports: [NgtCatmullRomCurve3],
  exports: [NgtCatmullRomCurve3],
})
export class NgtCatmullRomCurve3Module {}
