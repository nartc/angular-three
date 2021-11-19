// GENERATED
import { NgtCurve } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { Curves  } from 'three/examples/jsm/curves/CurveExtras';

@Directive({
  selector: 'ngt-knot-curve',
  exportAs: 'ngtKnotCurve',
  providers: [
    {
      provide: NgtCurve,
      useExisting: NgtKnotCurve,
    }
  ],
})
export class NgtKnotCurve extends NgtCurve<Curves.KnotCurve> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof Curves.KnotCurve> | undefined;

  @Input() set args(v: ConstructorParameters<typeof Curves.KnotCurve>) {
    this.extraArgs = v;
  }

  curveType = Curves.KnotCurve;
}
