// GENERATED

import { Directive, Input } from '@angular/core';
import { CubicBezierCurve } from 'three';
import { ThreeCurve } from '../abstracts';

@Directive({
  selector: 'ngt-cubicBezierCurve',
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
