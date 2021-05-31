// GENERATED
import { ThreeBufferGeometry } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { BufferGeometry } from 'three';

@Directive({
  selector: 'ngt-buffer-geometry',
  exportAs: 'ngtBufferGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: BufferGeometryDirective,
    },
  ],
})
export class BufferGeometryDirective extends ThreeBufferGeometry<BufferGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof BufferGeometry>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof BufferGeometry>) {
    this.extraArgs = v;
  }

  geometryType = BufferGeometry;
}
