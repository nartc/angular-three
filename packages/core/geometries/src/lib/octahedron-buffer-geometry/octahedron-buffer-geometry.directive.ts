// GENERATED

import { Directive, Input } from '@angular/core';
import { OctahedronBufferGeometry } from 'three';
import { ThreeBufferGeometry } from '../abstracts';

@Directive({
  selector: 'ngt-octahedronBufferGeometry,ngt-octahedronGeometry',
  exportAs: 'ngtOctahedronBufferGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: OctahedronBufferGeometryDirective,
    },
  ],
})
export class OctahedronBufferGeometryDirective extends ThreeBufferGeometry<OctahedronBufferGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof OctahedronBufferGeometry>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof OctahedronBufferGeometry>) {
    this.extraArgs = v;
  }

  geometryType = OctahedronBufferGeometry;
}
