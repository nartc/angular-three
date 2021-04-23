// GENERATED

import { Directive, Input } from '@angular/core';
import { PolyhedronBufferGeometry } from 'three';
import { ThreeBufferGeometry } from '../abstracts';

@Directive({
  selector: 'ngt-polyhedronBufferGeometry,ngt-polyhedronGeometry',
  exportAs: 'ngtPolyhedronBufferGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: PolyhedronBufferGeometryDirective,
    },
  ],
})
export class PolyhedronBufferGeometryDirective extends ThreeBufferGeometry<PolyhedronBufferGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof PolyhedronBufferGeometry>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof PolyhedronBufferGeometry>) {
    this.extraArgs = v;
  }

  geometryType = PolyhedronBufferGeometry;
}
