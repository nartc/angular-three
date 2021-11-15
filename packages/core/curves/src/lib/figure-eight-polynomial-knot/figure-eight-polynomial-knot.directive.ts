// GENERATED
import { NgtCurve } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { Curves  } from 'three/examples/jsm/curves/CurveExtras';

@Directive({
  selector: 'ngt-figure-eight-polynomial-knot',
  exportAs: 'ngtFigureEightPolynomialKnot',
  providers: [
    {
      provide: NgtCurve,
      useExisting: NgtFigureEightPolynomialKnot,
    },
  ],
})
export class NgtFigureEightPolynomialKnot extends NgtCurve<Curves.FigureEightPolynomialKnot> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof Curves.FigureEightPolynomialKnot> | undefined;

  @Input() set args(v: ConstructorParameters<typeof Curves.FigureEightPolynomialKnot>) {
    this.extraArgs = v;
  }

  curveType = Curves.FigureEightPolynomialKnot;
}
