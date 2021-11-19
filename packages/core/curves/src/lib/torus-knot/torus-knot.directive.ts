// GENERATED
import { NgtCurve } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { Curves  } from 'three/examples/jsm/curves/CurveExtras';

@Directive({
  selector: 'ngt-torus-knot',
  exportAs: 'ngtTorusKnot',
  providers: [
    {
      provide: NgtCurve,
      useExisting: NgtTorusKnot,
    }
  ],
})
export class NgtTorusKnot extends NgtCurve<Curves.TorusKnot> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof Curves.TorusKnot> | undefined;

  @Input() set args(v: ConstructorParameters<typeof Curves.TorusKnot>) {
    this.extraArgs = v;
  }

  curveType = Curves.TorusKnot;
}
