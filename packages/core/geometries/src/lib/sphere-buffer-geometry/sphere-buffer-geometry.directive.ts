import { Directive, Input } from '@angular/core';
import { SphereBufferGeometry } from 'three';
import { ThreeBufferGeometry } from '../abstracts';

@Directive({
  selector: 'ngt-sphereBufferGeometry',
  exportAs: 'ngtSphereBufferGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: SphereBufferGeometryDirective,
    },
  ],
})
export class SphereBufferGeometryDirective extends ThreeBufferGeometry<SphereBufferGeometry> {
  @Input() set args(v: ConstructorParameters<typeof SphereBufferGeometry>) {
    this.extraArgs = v;
  }

  geometryType = SphereBufferGeometry;
}
