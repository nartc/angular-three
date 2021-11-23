// GENERATED
import { NgtCurve } from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import { Curves  } from 'three/examples/jsm/curves/CurveExtras';

@Directive({
  selector: 'ngt-decorated-torus-knot5c',
  exportAs: 'ngtDecoratedTorusKnot5c',
  providers: [
    {
      provide: NgtCurve,
      useExisting: NgtDecoratedTorusKnot5c,
    }
  ],
})
export class NgtDecoratedTorusKnot5c extends NgtCurve<Curves.DecoratedTorusKnot5c> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof Curves.DecoratedTorusKnot5c> | undefined;

  @Input() set args(v: ConstructorParameters<typeof Curves.DecoratedTorusKnot5c>) {
    this.extraArgs = v;
  }

  curveType = Curves.DecoratedTorusKnot5c;
}

@NgModule({
  declarations: [NgtDecoratedTorusKnot5c],
  exports: [NgtDecoratedTorusKnot5c],
})
export class NgtDecoratedTorusKnot5cModule {}

