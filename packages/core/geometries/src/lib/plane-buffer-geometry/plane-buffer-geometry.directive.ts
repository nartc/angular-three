// GENERATED
import { ThreeBufferGeometry } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { PlaneBufferGeometry } from 'three';

@Directive({
  selector: 'ngt-plane-buffer-geometry,ngt-plane-geometry',
  exportAs: 'ngtPlaneBufferGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: PlaneBufferGeometryDirective,
    },
  ],
})
export class PlaneBufferGeometryDirective extends ThreeBufferGeometry<PlaneBufferGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof PlaneBufferGeometry>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof PlaneBufferGeometry>) {
    this.extraArgs = v;
  }

  geometryType = PlaneBufferGeometry;
}
