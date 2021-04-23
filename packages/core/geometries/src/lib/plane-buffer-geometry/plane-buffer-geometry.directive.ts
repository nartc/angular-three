// GENERATED

import { Directive, Input } from '@angular/core';
import { PlaneBufferGeometry } from 'three';
import { ThreeBufferGeometry } from '../abstracts';

@Directive({
  selector: 'ngt-planeBufferGeometry,ngt-planeGeometry',
  exportAs: 'ngtPlaneBufferGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: PlaneBufferGeometryDirective,
    },
  ],
})
export class PlaneBufferGeometryDirective extends ThreeBufferGeometry<PlaneBufferGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof PlaneBufferGeometry> | undefined;

  @Input() set args(v: ConstructorParameters<typeof PlaneBufferGeometry>) {
    this.extraArgs = v;
  }

  geometryType = PlaneBufferGeometry;
}
