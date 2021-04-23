// GENERATED

import { Directive, Input } from '@angular/core';
import { TorusBufferGeometry } from 'three';
import { ThreeBufferGeometry } from '../abstracts';

@Directive({
  selector: 'ngt-torusBufferGeometry,ngt-torusGeometry',
  exportAs: 'ngtTorusBufferGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: TorusBufferGeometryDirective,
    },
  ],
})
export class TorusBufferGeometryDirective extends ThreeBufferGeometry<TorusBufferGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof TorusBufferGeometry>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof TorusBufferGeometry>) {
    this.extraArgs = v;
  }

  geometryType = TorusBufferGeometry;
}
