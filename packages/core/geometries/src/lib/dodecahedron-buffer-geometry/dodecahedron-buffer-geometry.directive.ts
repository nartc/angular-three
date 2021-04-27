// GENERATED
import { ThreeBufferGeometry } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { DodecahedronBufferGeometry } from 'three';

@Directive({
  selector: 'ngt-dodecahedron-buffer-geometry,ngt-dodecahedron-geometry',
  exportAs: 'ngtDodecahedronBufferGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: DodecahedronBufferGeometryDirective,
    },
  ],
})
export class DodecahedronBufferGeometryDirective extends ThreeBufferGeometry<DodecahedronBufferGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof DodecahedronBufferGeometry>
    | undefined;

  @Input() set args(
    v: ConstructorParameters<typeof DodecahedronBufferGeometry>
  ) {
    this.extraArgs = v;
  }

  geometryType = DodecahedronBufferGeometry;
}
