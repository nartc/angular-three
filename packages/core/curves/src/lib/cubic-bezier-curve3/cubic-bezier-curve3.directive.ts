// GENERATED
import { NgtCurve } from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-cubic-bezier-curve3',
  exportAs: 'ngtCubicBezierCurve3',
  providers: [
    {
      provide: NgtCurve,
      useExisting: NgtCubicBezierCurve3,
    },
  ],
})
export class NgtCubicBezierCurve3 extends NgtCurve<THREE.CubicBezierCurve3> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.CubicBezierCurve3>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.CubicBezierCurve3>) {
    this.curveArgs = v;
  }

  curveType = THREE.CubicBezierCurve3;
}

@NgModule({
  declarations: [NgtCubicBezierCurve3],
  exports: [NgtCubicBezierCurve3],
})
export class NgtCubicBezierCurve3Module {}
