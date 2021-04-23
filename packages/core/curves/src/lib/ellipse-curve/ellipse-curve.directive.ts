// GENERATED

import { Directive, Input } from '@angular/core';
import { EllipseCurve } from 'three';
import { ThreeCurve } from '../abstracts';

@Directive({
  selector: 'ngt-ellipseCurve',
  exportAs: 'ngtEllipseCurve',
  providers: [
    {
      provide: ThreeCurve,
      useExisting: EllipseCurveDirective,
    },
  ],
})
export class EllipseCurveDirective extends ThreeCurve<EllipseCurve> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof EllipseCurve>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof EllipseCurve>) {
    this.extraArgs = v;
  }

  curveType = EllipseCurve;
}
