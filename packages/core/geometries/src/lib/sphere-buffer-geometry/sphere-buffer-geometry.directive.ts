// GENERATED

import { Directive, Input } from '@angular/core';
import { SphereBufferGeometry } from 'three';
import { ThreeBufferGeometry } from '../abstracts';

@Directive({
  selector: 'ngt-sphereBufferGeometry,ngt-sphereGeometry',
  exportAs: 'ngtSphereBufferGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: SphereBufferGeometryDirective,
    },
  ],
})
export class SphereBufferGeometryDirective extends ThreeBufferGeometry<SphereBufferGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof SphereBufferGeometry> | undefined;

  @Input() set args(v: ConstructorParameters<typeof SphereBufferGeometry>) {
    this.extraArgs = v;
  }

  geometryType = SphereBufferGeometry;
}
