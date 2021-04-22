import { Directive, Input } from '@angular/core';
import { DodecahedronBufferGeometry } from 'three';
import { ThreeBufferGeometry } from '../abstracts';

@Directive({
  selector: 'ngt-dodecahedronBufferGeometry',
  exportAs: 'ngtDodecahedronBufferGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: DodecahedronBufferGeometryDirective,
    },
  ],
})
export class DodecahedronBufferGeometryDirective extends ThreeBufferGeometry<DodecahedronBufferGeometry> {
  @Input() set args(
    v: ConstructorParameters<typeof DodecahedronBufferGeometry>
  ) {
    this.extraArgs = v;
  }

  geometryType = DodecahedronBufferGeometry;
}
