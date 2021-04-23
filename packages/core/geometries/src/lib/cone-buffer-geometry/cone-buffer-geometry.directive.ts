// GENERATED

import { Directive, Input } from '@angular/core';
import { ConeBufferGeometry } from 'three';
import { ThreeBufferGeometry } from '../abstracts';

@Directive({
  selector: 'ngt-coneBufferGeometry,ngt-coneGeometry',
  exportAs: 'ngtConeBufferGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: ConeBufferGeometryDirective,
    },
  ],
})
export class ConeBufferGeometryDirective extends ThreeBufferGeometry<ConeBufferGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof ConeBufferGeometry> | undefined;

  @Input() set args(v: ConstructorParameters<typeof ConeBufferGeometry>) {
    this.extraArgs = v;
  }

  geometryType = ConeBufferGeometry;
}
