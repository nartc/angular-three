// GENERATED
import { ThreeCurve } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { CubicBezierCurve } from 'three';

@Directive({
  selector: 'ngt-cubic-bezier-curve',
  exportAs: 'ngtCubicBezierCurve',
  providers: [
    {
      provide: ThreeCurve,
      useExisting: CubicBezierCurveDirective,
    },
  ],
})
export class CubicBezierCurveDirective extends ThreeCurve<CubicBezierCurve> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof CubicBezierCurve>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof CubicBezierCurve>) {
    this.extraArgs = v;
  }

  curveType = CubicBezierCurve;
}
