// GENERATED
import { ThreeBufferGeometry } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { SphereBufferGeometry } from 'three';

@Directive({
  selector: 'ngt-sphereBufferGeometry,ngt-sphereGeometry',
  exportAs: 'ngtSphereBufferGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: SphereBufferGeometryDirective,
    },
  ],
})
export class SphereBufferGeometryDirective extends ThreeBufferGeometry<SphereBufferGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof SphereBufferGeometry>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof SphereBufferGeometry>) {
    this.extraArgs = v;
  }

  geometryType = SphereBufferGeometry;
}
