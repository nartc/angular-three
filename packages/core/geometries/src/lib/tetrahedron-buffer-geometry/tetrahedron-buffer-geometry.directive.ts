// GENERATED

import { Directive, Input } from '@angular/core';
import { TetrahedronBufferGeometry } from 'three';
import { ThreeBufferGeometry } from '../abstracts';

@Directive({
  selector: 'ngt-tetrahedronBufferGeometry,ngt-tetrahedronGeometry',
  exportAs: 'ngtTetrahedronBufferGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: TetrahedronBufferGeometryDirective,
    },
  ],
})
export class TetrahedronBufferGeometryDirective extends ThreeBufferGeometry<TetrahedronBufferGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof TetrahedronBufferGeometry>
    | undefined;

  @Input() set args(
    v: ConstructorParameters<typeof TetrahedronBufferGeometry>
  ) {
    this.extraArgs = v;
  }

  geometryType = TetrahedronBufferGeometry;
}
