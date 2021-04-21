import { Directive, Input } from '@angular/core';
import { IcosahedronGeometry } from 'three';
import { ThreeBufferGeometry } from '../abstracts';

@Directive({
  selector: 'ngt-icosahedronGeometry',
  exportAs: 'ngtIcosahedronGeometry',
  providers: [
    { provide: ThreeBufferGeometry, useExisting: IcosahedronGeometryDirective },
  ],
})
export class IcosahedronGeometryDirective extends ThreeBufferGeometry<IcosahedronGeometry> {
  @Input() set args(v: ConstructorParameters<typeof IcosahedronGeometry>) {
    this.extraArgs = v;
  }

  geometryType = IcosahedronGeometry;
}
