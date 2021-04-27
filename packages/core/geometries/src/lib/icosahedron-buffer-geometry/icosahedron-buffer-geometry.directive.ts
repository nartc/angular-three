// GENERATED
import { ThreeBufferGeometry } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { IcosahedronBufferGeometry } from 'three';

@Directive({
  selector: 'ngt-icosahedron-buffer-geometry,ngt-icosahedron-geometry',
  exportAs: 'ngtIcosahedronBufferGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: IcosahedronBufferGeometryDirective,
    },
  ],
})
export class IcosahedronBufferGeometryDirective extends ThreeBufferGeometry<IcosahedronBufferGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof IcosahedronBufferGeometry>
    | undefined;

  @Input() set args(
    v: ConstructorParameters<typeof IcosahedronBufferGeometry>
  ) {
    this.extraArgs = v;
  }

  geometryType = IcosahedronBufferGeometry;
}
