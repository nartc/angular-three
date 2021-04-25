// GENERATED
import { ThreeBufferGeometry } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { CylinderBufferGeometry } from 'three';

@Directive({
  selector: 'ngt-cylinderBufferGeometry,ngt-cylinderGeometry',
  exportAs: 'ngtCylinderBufferGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: CylinderBufferGeometryDirective,
    },
  ],
})
export class CylinderBufferGeometryDirective extends ThreeBufferGeometry<CylinderBufferGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof CylinderBufferGeometry>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof CylinderBufferGeometry>) {
    this.extraArgs = v;
  }

  geometryType = CylinderBufferGeometry;
}
