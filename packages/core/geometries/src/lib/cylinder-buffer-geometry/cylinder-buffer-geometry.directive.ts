import { Directive } from '@angular/core';
import { CylinderBufferGeometry } from 'three';
import { ThreeBufferGeometry } from '../abstracts';

@Directive({
  selector: 'ngt-cylinderBufferGeometry',
  exportAs: 'ngtCylinderBufferGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: CylinderBufferGeometryDirective,
    },
  ],
})
export class CylinderBufferGeometryDirective extends ThreeBufferGeometry<
  CylinderBufferGeometry,
  typeof CylinderBufferGeometry
> {
  static ngAcceptInputType_args: ConstructorParameters<
    typeof CylinderBufferGeometry
  >;

  geometryType = CylinderBufferGeometry;
}
