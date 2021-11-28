// GENERATED
import { NgtCurve } from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import { Curves  } from 'three/examples/jsm/curves/CurveExtras';

@Directive({
  selector: 'ngt-granny-knot',
  exportAs: 'ngtGrannyKnot',
  providers: [
    {
      provide: NgtCurve,
      useExisting: NgtGrannyKnot,
    }
  ],
})
export class NgtGrannyKnot extends NgtCurve<Curves.GrannyKnot> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof Curves.GrannyKnot> | undefined;

  @Input() set args(v: ConstructorParameters<typeof Curves.GrannyKnot>) {
    this.extraArgs = v;
  }

  curveType = Curves.GrannyKnot;
}

@NgModule({
  declarations: [NgtGrannyKnot],
  exports: [NgtGrannyKnot],
})
export class NgtGrannyKnotModule {}

