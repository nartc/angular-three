// GENERATED
import { NgtCurve } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { Curves  } from 'three/examples/jsm/curves/CurveExtras';

@Directive({
  selector: 'ngt-heart-curve',
  exportAs: 'ngtHeartCurve',
  providers: [
    {
      provide: NgtCurve,
      useExisting: NgtHeartCurve,
    }
  ],
})
export class NgtHeartCurve extends NgtCurve<Curves.HeartCurve> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof Curves.HeartCurve> | undefined;

  @Input() set args(v: ConstructorParameters<typeof Curves.HeartCurve>) {
    this.extraArgs = v;
  }

  curveType = Curves.HeartCurve;
}
