// GENERATED
import { ThreeCurve } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { QuadraticBezierCurve } from 'three';

@Directive({
  selector: 'ngt-quadratic-bezier-curve',
  exportAs: 'ngtQuadraticBezierCurve',
  providers: [
    {
      provide: ThreeCurve,
      useExisting: QuadraticBezierCurveDirective,
    },
  ],
})
export class QuadraticBezierCurveDirective extends ThreeCurve<QuadraticBezierCurve> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof QuadraticBezierCurve>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof QuadraticBezierCurve>) {
    this.extraArgs = v;
  }

  curveType = QuadraticBezierCurve;
}
