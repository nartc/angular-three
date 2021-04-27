// GENERATED
import { ThreeBufferGeometry } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { ExtrudeBufferGeometry } from 'three';

@Directive({
  selector: 'ngt-extrude-buffer-geometry,ngt-extrude-geometry',
  exportAs: 'ngtExtrudeBufferGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: ExtrudeBufferGeometryDirective,
    },
  ],
})
export class ExtrudeBufferGeometryDirective extends ThreeBufferGeometry<ExtrudeBufferGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof ExtrudeBufferGeometry>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof ExtrudeBufferGeometry>) {
    this.extraArgs = v;
  }

  geometryType = ExtrudeBufferGeometry;
}
