import { Directive, Input } from '@angular/core';
import { CircleBufferGeometry } from 'three';
import { ThreeBufferGeometry } from '../abstracts';

@Directive({
  selector: 'ngt-circleBufferGeometry',
  exportAs: 'ngtCircleBufferGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: CircleBufferGeometryDirective,
    },
  ],
})
export class CircleBufferGeometryDirective extends ThreeBufferGeometry<CircleBufferGeometry> {
  @Input() set args(v: ConstructorParameters<typeof CircleBufferGeometry>) {
    this.extraArgs = v;
  }

  geometryType = CircleBufferGeometry;
}
