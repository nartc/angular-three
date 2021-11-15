// GENERATED
import { NgtCurve } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { NURBSCurve } from 'three/examples/jsm/curves/NURBSCurve';

@Directive({
  selector: 'ngt-nurbscurve',
  exportAs: 'ngtNURBSCurve',
  providers: [
    {
      provide: NgtCurve,
      useExisting: NgtNURBSCurve,
    },
  ],
})
export class NgtNURBSCurve extends NgtCurve<NURBSCurve> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof NURBSCurve>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof NURBSCurve>) {
    this.extraArgs = v;
  }

  curveType = NURBSCurve;
}
