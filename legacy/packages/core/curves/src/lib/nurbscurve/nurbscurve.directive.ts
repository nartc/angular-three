// GENERATED
import { NgtCurve } from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import { NURBSCurve  } from 'three/examples/jsm/curves/NURBSCurve';

@Directive({
  selector: 'ngt-nurbscurve',
  exportAs: 'ngtNURBSCurve',
  providers: [
    {
      provide: NgtCurve,
      useExisting: NgtNURBSCurve,
    }
  ],
})
export class NgtNURBSCurve extends NgtCurve<NURBSCurve> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof NURBSCurve> | undefined;

  @Input() set args(v: ConstructorParameters<typeof NURBSCurve>) {
    this.extraArgs = v;
  }

  curveType = NURBSCurve;
}

@NgModule({
  declarations: [NgtNURBSCurve],
  exports: [NgtNURBSCurve],
})
export class NgtNURBSCurveModule {}

