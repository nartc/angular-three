// GENERATED
import { ThreeBufferGeometry } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { CircleBufferGeometry } from 'three';

@Directive({
  selector: 'ngt-circleBufferGeometry,ngt-circleGeometry',
  exportAs: 'ngtCircleBufferGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: CircleBufferGeometryDirective,
    },
  ],
})
export class CircleBufferGeometryDirective extends ThreeBufferGeometry<CircleBufferGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof CircleBufferGeometry>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof CircleBufferGeometry>) {
    this.extraArgs = v;
  }

  geometryType = CircleBufferGeometry;
}
