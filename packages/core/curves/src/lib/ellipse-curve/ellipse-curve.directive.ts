// GENERATED
import { ThreeCurve } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { EllipseCurve } from 'three';

@Directive({
  selector: 'ngt-ellipse-curve',
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
