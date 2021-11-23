// GENERATED
import { NgtCurve } from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-ellipse-curve',
  exportAs: 'ngtEllipseCurve',
  providers: [
    {
      provide: NgtCurve,
      useExisting: NgtEllipseCurve,
    }
  ],
})
export class NgtEllipseCurve extends NgtCurve<THREE.EllipseCurve> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.EllipseCurve> | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.EllipseCurve>) {
    this.extraArgs = v;
  }

  curveType = THREE.EllipseCurve;
}

@NgModule({
  declarations: [NgtEllipseCurve],
  exports: [NgtEllipseCurve],
})
export class NgtEllipseCurveModule {}

