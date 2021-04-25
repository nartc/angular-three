// GENERATED
import { ThreeBufferGeometry } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { RingBufferGeometry } from 'three';

@Directive({
  selector: 'ngt-ringBufferGeometry,ngt-ringGeometry',
  exportAs: 'ngtRingBufferGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: RingBufferGeometryDirective,
    },
  ],
})
export class RingBufferGeometryDirective extends ThreeBufferGeometry<RingBufferGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof RingBufferGeometry>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof RingBufferGeometry>) {
    this.extraArgs = v;
  }

  geometryType = RingBufferGeometry;
}
