// GENERATED
import { ThreeBufferGeometry } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry';

@Directive({
  selector: 'ngt-rounded-box-geometry',
  exportAs: 'ngtRoundedBoxGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: RoundedBoxGeometryDirective,
    },
  ],
})
export class RoundedBoxGeometryDirective extends ThreeBufferGeometry<RoundedBoxGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof RoundedBoxGeometry>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof RoundedBoxGeometry>) {
    this.extraArgs = v;
  }

  geometryType = RoundedBoxGeometry;
}
