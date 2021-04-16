import { Directive } from '@angular/core';
import { BoxBufferGeometry } from 'three';
import { ThreeBufferGeometry } from '../abstracts';

@Directive({
  selector: 'ngt-boxBufferGeometry',
  exportAs: 'ngtBoxBufferGeometry',
  providers: [
    { provide: ThreeBufferGeometry, useExisting: BoxBufferGeometryDirective },
  ],
})
export class BoxBufferGeometryDirective extends ThreeBufferGeometry<
  BoxBufferGeometry,
  typeof BoxBufferGeometry
> {
  static ngAcceptInputType_args: ConstructorParameters<
    typeof BoxBufferGeometry
  >;

  geometryType = BoxBufferGeometry;
}
