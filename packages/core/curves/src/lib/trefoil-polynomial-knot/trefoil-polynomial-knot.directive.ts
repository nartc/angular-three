// GENERATED
import { NgtCurve } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { Curves  } from 'three/examples/jsm/curves/CurveExtras';

@Directive({
  selector: 'ngt-trefoil-polynomial-knot',
  exportAs: 'ngtTrefoilPolynomialKnot',
  providers: [
    {
      provide: NgtCurve,
      useExisting: NgtTrefoilPolynomialKnot,
    }
  ],
})
export class NgtTrefoilPolynomialKnot extends NgtCurve<Curves.TrefoilPolynomialKnot> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof Curves.TrefoilPolynomialKnot> | undefined;

  @Input() set args(v: ConstructorParameters<typeof Curves.TrefoilPolynomialKnot>) {
    this.extraArgs = v;
  }

  curveType = Curves.TrefoilPolynomialKnot;
}
