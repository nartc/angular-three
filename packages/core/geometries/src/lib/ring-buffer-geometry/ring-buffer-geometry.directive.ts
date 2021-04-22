import { Directive, Input } from '@angular/core';
import { RingBufferGeometry } from 'three';
import { ThreeBufferGeometry } from '../abstracts';

@Directive({
  selector: 'ngt-ringBufferGeometry',
  exportAs: 'ngtRingBufferGeometry',
  providers: [
    { provide: ThreeBufferGeometry, useExisting: RingBufferGeometryDirective },
  ],
})
export class RingBufferGeometryDirective extends ThreeBufferGeometry<RingBufferGeometry> {
  @Input() set args(v: ConstructorParameters<typeof RingBufferGeometry>) {
    this.extraArgs = v;
  }

  geometryType = RingBufferGeometry;
}
