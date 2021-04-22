import { Directive, Input } from '@angular/core';
import { OctahedronBufferGeometry } from 'three';
import { ThreeBufferGeometry } from '../abstracts';

@Directive({
  selector: 'ngt-octahedronBufferGeometry',
  exportAs: 'ngtOctahedronBufferGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: OctahedronBufferGeometryDirective,
    },
  ],
})
export class OctahedronBufferGeometryDirective extends ThreeBufferGeometry<OctahedronBufferGeometry> {
  @Input() set args(v: ConstructorParameters<typeof OctahedronBufferGeometry>) {
    this.extraArgs = v;
  }

  geometryType = OctahedronBufferGeometry;
}
