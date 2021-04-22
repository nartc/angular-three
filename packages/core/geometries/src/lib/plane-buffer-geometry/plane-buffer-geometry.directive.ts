import { Directive, Input } from '@angular/core';
import { PlaneBufferGeometry } from 'three';
import { ThreeBufferGeometry } from '../abstracts';

@Directive({
  selector: 'ngt-planeBufferGeometry',
  exportAs: 'ngtPlaneBufferGeometry',
  providers: [
    { provide: ThreeBufferGeometry, useExisting: PlaneBufferGeometryDirective },
  ],
})
export class PlaneBufferGeometryDirective extends ThreeBufferGeometry<PlaneBufferGeometry> {
  @Input() set args(v: ConstructorParameters<typeof PlaneBufferGeometry>) {
    this.extraArgs = v;
  }

  geometryType = PlaneBufferGeometry;
}
