// GENERATED
import { NgtCurve } from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-quadratic-bezier-curve3',
  exportAs: 'ngtQuadraticBezierCurve3',
  providers: [
    {
      provide: NgtCurve,
      useExisting: NgtQuadraticBezierCurve3,
    },
  ],
})
export class NgtQuadraticBezierCurve3 extends NgtCurve<THREE.QuadraticBezierCurve3> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.QuadraticBezierCurve3>
    | undefined;

  @Input() set args(
    v: ConstructorParameters<typeof THREE.QuadraticBezierCurve3>
  ) {
    this.curveArgs = v;
  }

  curveType = THREE.QuadraticBezierCurve3;
}

@NgModule({
  declarations: [NgtQuadraticBezierCurve3],
  exports: [NgtQuadraticBezierCurve3],
})
export class NgtQuadraticBezierCurve3Module {}
