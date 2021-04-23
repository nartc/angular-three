// GENERATED

import { Directive, Input } from '@angular/core';
import { IcosahedronBufferGeometry } from 'three';
import { ThreeBufferGeometry } from '../abstracts';

@Directive({
  selector: 'ngt-icosahedronBufferGeometry,ngt-icosahedronGeometry',
  exportAs: 'ngtIcosahedronBufferGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: IcosahedronBufferGeometryDirective,
    },
  ],
})
export class IcosahedronBufferGeometryDirective extends ThreeBufferGeometry<IcosahedronBufferGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof IcosahedronBufferGeometry> | undefined;

  @Input() set args(v: ConstructorParameters<typeof IcosahedronBufferGeometry>) {
    this.extraArgs = v;
  }

  geometryType = IcosahedronBufferGeometry;
}
