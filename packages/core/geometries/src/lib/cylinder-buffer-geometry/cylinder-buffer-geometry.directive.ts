import { Directive, Input } from '@angular/core';
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
  @Input() set args(v: ConstructorParameters<typeof CylinderBufferGeometry>) {
    this.extraArgs = v;
  }

  geometryType = CylinderBufferGeometry;
}
