// GENERATED
import { NgtCurve } from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-line-curve',
  exportAs: 'ngtLineCurve',
  providers: [
    {
      provide: NgtCurve,
      useExisting: NgtLineCurve,
    },
  ],
})
export class NgtLineCurve extends NgtCurve<THREE.LineCurve> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.LineCurve>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.LineCurve>) {
    this.curveArgs = v;
  }

  curveType = THREE.LineCurve;
}

@NgModule({
  declarations: [NgtLineCurve],
  exports: [NgtLineCurve],
})
export class NgtLineCurveModule {}
