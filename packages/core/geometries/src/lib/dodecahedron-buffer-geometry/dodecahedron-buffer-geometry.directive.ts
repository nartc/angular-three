// GENERATED

import { Directive, Input } from '@angular/core';
import { DodecahedronBufferGeometry } from 'three';
import { ThreeBufferGeometry } from '../abstracts';

@Directive({
  selector: 'ngt-dodecahedronBufferGeometry,ngt-dodecahedronGeometry',
  exportAs: 'ngtDodecahedronBufferGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: DodecahedronBufferGeometryDirective,
    },
  ],
})
export class DodecahedronBufferGeometryDirective extends ThreeBufferGeometry<DodecahedronBufferGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof DodecahedronBufferGeometry>
    | undefined;

  @Input() set args(
    v: ConstructorParameters<typeof DodecahedronBufferGeometry>
  ) {
    this.extraArgs = v;
  }

  geometryType = DodecahedronBufferGeometry;
}
