// GENERATED
import { ThreeBufferGeometry } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { BoxBufferGeometry } from 'three';

@Directive({
  selector: 'ngt-box-buffer-geometry,ngt-box-geometry',
  exportAs: 'ngtBoxBufferGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: BoxBufferGeometryDirective,
    },
  ],
})
export class BoxBufferGeometryDirective extends ThreeBufferGeometry<BoxBufferGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof BoxBufferGeometry>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof BoxBufferGeometry>) {
    this.extraArgs = v;
  }

  geometryType = BoxBufferGeometry;
}
