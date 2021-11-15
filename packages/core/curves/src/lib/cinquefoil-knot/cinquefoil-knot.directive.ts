// GENERATED
import { NgtCurve } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { Curves } from 'three/examples/jsm/curves/CurveExtras';

@Directive({
  selector: 'ngt-cinquefoil-knot',
  exportAs: 'ngtCinquefoilKnot',
  providers: [
    {
      provide: NgtCurve,
      useExisting: NgtCinquefoilKnot,
    },
  ],
})
export class NgtCinquefoilKnot extends NgtCurve<Curves.CinquefoilKnot> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof Curves.CinquefoilKnot>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof Curves.CinquefoilKnot>) {
    this.extraArgs = v;
  }

  curveType = Curves.CinquefoilKnot;
}
