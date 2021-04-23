// GENERATED

import { Directive, Input } from '@angular/core';
import { LineCurve3 } from 'three';
import { ThreeCurve } from '../abstracts';

@Directive({
  selector: 'ngt-lineCurve3',
  exportAs: 'ngtLineCurve3',
  providers: [
    {
      provide: ThreeCurve,
      useExisting: LineCurve3Directive,
    },
  ],
})
export class LineCurve3Directive extends ThreeCurve<LineCurve3> {
  static ngAcceptInputType_args: ConstructorParameters<typeof LineCurve3> | undefined;

  @Input() set args(v: ConstructorParameters<typeof LineCurve3>) {
    this.extraArgs = v;
  }

  curveType = LineCurve3;
}
