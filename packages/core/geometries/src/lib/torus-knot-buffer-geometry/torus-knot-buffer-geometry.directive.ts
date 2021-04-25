// GENERATED
import { ThreeBufferGeometry } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { TorusKnotBufferGeometry } from 'three';

@Directive({
  selector: 'ngt-torusKnotBufferGeometry,ngt-torusKnotGeometry',
  exportAs: 'ngtTorusKnotBufferGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: TorusKnotBufferGeometryDirective,
    },
  ],
})
export class TorusKnotBufferGeometryDirective extends ThreeBufferGeometry<TorusKnotBufferGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof TorusKnotBufferGeometry>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof TorusKnotBufferGeometry>) {
    this.extraArgs = v;
  }

  geometryType = TorusKnotBufferGeometry;
}
