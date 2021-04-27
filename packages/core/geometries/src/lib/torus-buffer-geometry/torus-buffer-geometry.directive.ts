// GENERATED
import { ThreeBufferGeometry } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { TorusBufferGeometry } from 'three';

@Directive({
  selector: 'ngt-torus-buffer-geometry,ngt-torus-geometry',
  exportAs: 'ngtTorusBufferGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: TorusBufferGeometryDirective,
    },
  ],
})
export class TorusBufferGeometryDirective extends ThreeBufferGeometry<TorusBufferGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof TorusBufferGeometry>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof TorusBufferGeometry>) {
    this.extraArgs = v;
  }

  geometryType = TorusBufferGeometry;
}
