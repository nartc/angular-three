// GENERATED
import { NgtGeometry } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry';

@Directive({
  selector: 'ngt-convex-geometry',
  exportAs: 'ngtConvexGeometry',
  providers: [
    {
      provide: NgtGeometry,
      useExisting: NgtConvexGeometry,
    },
  ],
})
export class NgtConvexGeometry extends NgtGeometry<ConvexGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof ConvexGeometry>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof ConvexGeometry>) {
    this.extraArgs = v;
  }

  geometryType = ConvexGeometry;
}
