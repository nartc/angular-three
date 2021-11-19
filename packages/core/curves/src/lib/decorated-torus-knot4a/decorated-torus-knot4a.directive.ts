// GENERATED
import { NgtCurve } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { Curves  } from 'three/examples/jsm/curves/CurveExtras';

@Directive({
  selector: 'ngt-decorated-torus-knot4a',
  exportAs: 'ngtDecoratedTorusKnot4a',
  providers: [
    {
      provide: NgtCurve,
      useExisting: NgtDecoratedTorusKnot4a,
    }
  ],
})
export class NgtDecoratedTorusKnot4a extends NgtCurve<Curves.DecoratedTorusKnot4a> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof Curves.DecoratedTorusKnot4a> | undefined;

  @Input() set args(v: ConstructorParameters<typeof Curves.DecoratedTorusKnot4a>) {
    this.extraArgs = v;
  }

  curveType = Curves.DecoratedTorusKnot4a;
}
