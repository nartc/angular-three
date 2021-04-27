// GENERATED
import { ThreeBufferGeometry } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { LatheBufferGeometry } from 'three';

@Directive({
  selector: 'ngt-lathe-buffer-geometry,ngt-lathe-geometry',
  exportAs: 'ngtLatheBufferGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: LatheBufferGeometryDirective,
    },
  ],
})
export class LatheBufferGeometryDirective extends ThreeBufferGeometry<LatheBufferGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof LatheBufferGeometry>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof LatheBufferGeometry>) {
    this.extraArgs = v;
  }

  geometryType = LatheBufferGeometry;
}
