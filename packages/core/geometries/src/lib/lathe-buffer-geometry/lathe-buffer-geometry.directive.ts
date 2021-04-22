import { Directive, Input } from '@angular/core';
import { LatheBufferGeometry } from 'three';
import { ThreeBufferGeometry } from '../abstracts';

@Directive({
  selector: 'ngt-latheBufferGeometry',
  exportAs: 'ngtLatheBufferGeometry',
  providers: [
    { provide: ThreeBufferGeometry, useExisting: LatheBufferGeometryDirective },
  ],
})
export class LatheBufferGeometryDirective extends ThreeBufferGeometry<LatheBufferGeometry> {
  @Input() set args(v: ConstructorParameters<typeof LatheBufferGeometry>) {
    this.extraArgs = v;
  }

  geometryType = LatheBufferGeometry;
}
