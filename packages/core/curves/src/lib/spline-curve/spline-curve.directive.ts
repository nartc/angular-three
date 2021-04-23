// GENERATED

import { Directive, Input } from '@angular/core';
import { SplineCurve } from 'three';
import { ThreeCurve } from '../abstracts';

@Directive({
  selector: 'ngt-splineCurve',
  exportAs: 'ngtSplineCurve',
  providers: [
    {
      provide: ThreeCurve,
      useExisting: SplineCurveDirective,
    },
  ],
})
export class SplineCurveDirective extends ThreeCurve<SplineCurve> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof SplineCurve>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof SplineCurve>) {
    this.extraArgs = v;
  }

  curveType = SplineCurve;
}
