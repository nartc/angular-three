// GENERATED
import { NgtCurve } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { Curves  } from 'three/examples/jsm/curves/CurveExtras';

@Directive({
  selector: 'ngt-helix-curve',
  exportAs: 'ngtHelixCurve',
  providers: [
    {
      provide: NgtCurve,
      useExisting: NgtHelixCurve,
    },
  ],
})
export class NgtHelixCurve extends NgtCurve<Curves.HelixCurve> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof Curves.HelixCurve> | undefined;

  @Input() set args(v: ConstructorParameters<typeof Curves.HelixCurve>) {
    this.extraArgs = v;
  }

  curveType = Curves.HelixCurve;
}
