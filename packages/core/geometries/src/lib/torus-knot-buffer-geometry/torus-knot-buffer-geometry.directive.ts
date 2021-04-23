// GENERATED

import { Directive, Input } from '@angular/core';
import { TorusKnotBufferGeometry } from 'three';
import { ThreeBufferGeometry } from '../abstracts';

@Directive({
  selector: 'ngt-torusKnotBufferGeometry,ngt-torusKnotGeometry',
  exportAs: 'ngtTorusKnotBufferGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: TorusKnotBufferGeometryDirective,
    },
  ],
})
export class TorusKnotBufferGeometryDirective extends ThreeBufferGeometry<TorusKnotBufferGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof TorusKnotBufferGeometry>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof TorusKnotBufferGeometry>) {
    this.extraArgs = v;
  }

  geometryType = TorusKnotBufferGeometry;
}
