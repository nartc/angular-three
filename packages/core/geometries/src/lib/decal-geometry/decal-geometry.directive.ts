// GENERATED
import { ThreeBufferGeometry } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry';

@Directive({
  selector: 'ngt-decal-geometry',
  exportAs: 'ngtDecalGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: DecalGeometryDirective,
    },
  ],
})
export class DecalGeometryDirective extends ThreeBufferGeometry<DecalGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof DecalGeometry>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof DecalGeometry>) {
    this.extraArgs = v;
  }

  geometryType = DecalGeometry;
}
