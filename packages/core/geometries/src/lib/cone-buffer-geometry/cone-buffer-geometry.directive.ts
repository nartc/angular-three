// GENERATED
import { ThreeBufferGeometry } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { ConeBufferGeometry } from 'three';

@Directive({
  selector: 'ngt-cone-buffer-geometry,ngt-cone-geometry',
  exportAs: 'ngtConeBufferGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: ConeBufferGeometryDirective,
    },
  ],
})
export class ConeBufferGeometryDirective extends ThreeBufferGeometry<ConeBufferGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof ConeBufferGeometry>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof ConeBufferGeometry>) {
    this.extraArgs = v;
  }

  geometryType = ConeBufferGeometry;
}
