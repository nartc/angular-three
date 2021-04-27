// GENERATED
import { ThreeCurve } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { LineCurve } from 'three';

@Directive({
  selector: 'ngt-line-curve',
  exportAs: 'ngtLineCurve',
  providers: [
    {
      provide: ThreeCurve,
      useExisting: LineCurveDirective,
    },
  ],
})
export class LineCurveDirective extends ThreeCurve<LineCurve> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof LineCurve>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof LineCurve>) {
    this.extraArgs = v;
  }

  curveType = LineCurve;
}
