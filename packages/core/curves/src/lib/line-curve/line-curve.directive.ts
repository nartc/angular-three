// GENERATED

import { Directive, Input } from '@angular/core';
import { LineCurve } from 'three';
import { ThreeCurve } from '../abstracts';

@Directive({
  selector: 'ngt-lineCurve',
  exportAs: 'ngtLineCurve',
  providers: [
    {
      provide: ThreeCurve,
      useExisting: LineCurveDirective,
    },
  ],
})
export class LineCurveDirective extends ThreeCurve<LineCurve> {
  static ngAcceptInputType_args: ConstructorParameters<typeof LineCurve> | undefined;

  @Input() set args(v: ConstructorParameters<typeof LineCurve>) {
    this.extraArgs = v;
  }

  curveType = LineCurve;
}
