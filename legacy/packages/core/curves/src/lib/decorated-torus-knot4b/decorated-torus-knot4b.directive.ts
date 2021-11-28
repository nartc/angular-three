// GENERATED
import { NgtCurve } from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import { Curves  } from 'three/examples/jsm/curves/CurveExtras';

@Directive({
  selector: 'ngt-decorated-torus-knot4b',
  exportAs: 'ngtDecoratedTorusKnot4b',
  providers: [
    {
      provide: NgtCurve,
      useExisting: NgtDecoratedTorusKnot4b,
    }
  ],
})
export class NgtDecoratedTorusKnot4b extends NgtCurve<Curves.DecoratedTorusKnot4b> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof Curves.DecoratedTorusKnot4b> | undefined;

  @Input() set args(v: ConstructorParameters<typeof Curves.DecoratedTorusKnot4b>) {
    this.extraArgs = v;
  }

  curveType = Curves.DecoratedTorusKnot4b;
}

@NgModule({
  declarations: [NgtDecoratedTorusKnot4b],
  exports: [NgtDecoratedTorusKnot4b],
})
export class NgtDecoratedTorusKnot4bModule {}

