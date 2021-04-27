// GENERATED
import { ThreeBufferGeometry } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { OctahedronBufferGeometry } from 'three';

@Directive({
  selector: 'ngt-octahedron-buffer-geometry,ngt-octahedron-geometry',
  exportAs: 'ngtOctahedronBufferGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: OctahedronBufferGeometryDirective,
    },
  ],
})
export class OctahedronBufferGeometryDirective extends ThreeBufferGeometry<OctahedronBufferGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof OctahedronBufferGeometry>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof OctahedronBufferGeometry>) {
    this.extraArgs = v;
  }

  geometryType = OctahedronBufferGeometry;
}
