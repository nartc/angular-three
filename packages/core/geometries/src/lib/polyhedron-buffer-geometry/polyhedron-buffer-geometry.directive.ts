import { Directive, Input } from '@angular/core';
import { PolyhedronBufferGeometry } from 'three';
import { ThreeBufferGeometry } from '../abstracts';

@Directive({
  selector: 'ngt-polyhedronBufferGeometry',
  exportAs: 'ngtPolyhedronBufferGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: PolyhedronBufferGeometryDirective,
    },
  ],
})
export class PolyhedronBufferGeometryDirective extends ThreeBufferGeometry<PolyhedronBufferGeometry> {
  @Input() set args(v: ConstructorParameters<typeof PolyhedronBufferGeometry>) {
    this.extraArgs = v;
  }

  geometryType = PolyhedronBufferGeometry;
}
