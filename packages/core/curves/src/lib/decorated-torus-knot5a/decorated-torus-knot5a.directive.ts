// GENERATED
import { NgtCurve } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { Curves } from 'three/examples/jsm/curves/CurveExtras';

@Directive({
  selector: 'ngt-decorated-torus-knot5a',
  exportAs: 'ngtDecoratedTorusKnot5a',
  providers: [
    {
      provide: NgtCurve,
      useExisting: NgtDecoratedTorusKnot5a,
    },
  ],
})
export class NgtDecoratedTorusKnot5a extends NgtCurve<Curves.DecoratedTorusKnot5a> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof Curves.DecoratedTorusKnot5a>
    | undefined;

  @Input() set args(
    v: ConstructorParameters<typeof Curves.DecoratedTorusKnot5a>
  ) {
    this.extraArgs = v;
  }

  curveType = Curves.DecoratedTorusKnot5a;
}
