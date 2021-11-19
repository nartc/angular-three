// GENERATED
import { NgtCurve } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { Curves  } from 'three/examples/jsm/curves/CurveExtras';

@Directive({
  selector: 'ngt-trefoil-knot',
  exportAs: 'ngtTrefoilKnot',
  providers: [
    {
      provide: NgtCurve,
      useExisting: NgtTrefoilKnot,
    }
  ],
})
export class NgtTrefoilKnot extends NgtCurve<Curves.TrefoilKnot> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof Curves.TrefoilKnot> | undefined;

  @Input() set args(v: ConstructorParameters<typeof Curves.TrefoilKnot>) {
    this.extraArgs = v;
  }

  curveType = Curves.TrefoilKnot;
}
