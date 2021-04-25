// GENERATED
import { ThreeCurve } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { QuadraticBezierCurve3 } from 'three';

@Directive({
  selector: 'ngt-quadraticBezierCurve3',
  exportAs: 'ngtQuadraticBezierCurve3',
  providers: [
    {
      provide: ThreeCurve,
      useExisting: QuadraticBezierCurve3Directive,
    },
  ],
})
export class QuadraticBezierCurve3Directive extends ThreeCurve<QuadraticBezierCurve3> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof QuadraticBezierCurve3>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof QuadraticBezierCurve3>) {
    this.extraArgs = v;
  }

  curveType = QuadraticBezierCurve3;
}
