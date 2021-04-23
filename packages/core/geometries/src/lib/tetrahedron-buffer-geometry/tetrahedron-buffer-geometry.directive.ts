import { Directive, Input } from '@angular/core';
import { TetrahedronBufferGeometry } from 'three';
import { ThreeBufferGeometry } from '../abstracts';

@Directive({
  selector: 'ngt-tetrahedronBufferGeometry',
  exportAs: 'ngtTetrahedronBufferGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: TetrahedronBufferGeometryDirective,
    },
  ],
})
export class TetrahedronBufferGeometryDirective extends ThreeBufferGeometry<TetrahedronBufferGeometry> {
  @Input() set args(
    v: ConstructorParameters<typeof TetrahedronBufferGeometry>
  ) {
    this.extraArgs = v;
  }

  geometryType = TetrahedronBufferGeometry;
}
