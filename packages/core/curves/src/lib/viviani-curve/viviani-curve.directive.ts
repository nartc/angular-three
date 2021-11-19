// GENERATED
import { NgtCurve } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { Curves  } from 'three/examples/jsm/curves/CurveExtras';

@Directive({
  selector: 'ngt-viviani-curve',
  exportAs: 'ngtVivianiCurve',
  providers: [
    {
      provide: NgtCurve,
      useExisting: NgtVivianiCurve,
    }
  ],
})
export class NgtVivianiCurve extends NgtCurve<Curves.VivianiCurve> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof Curves.VivianiCurve> | undefined;

  @Input() set args(v: ConstructorParameters<typeof Curves.VivianiCurve>) {
    this.extraArgs = v;
  }

  curveType = Curves.VivianiCurve;
}
