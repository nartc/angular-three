import { Directive, Input } from '@angular/core';
import { ConeBufferGeometry } from 'three';
import { ThreeBufferGeometry } from '../abstracts';

@Directive({
  selector: 'ngt-coneBufferGeometry',
  exportAs: 'ngtConeBufferGeometry',
  providers: [
    { provide: ThreeBufferGeometry, useExisting: ConeBufferGeometryDirective },
  ],
})
export class ConeBufferGeometryDirective extends ThreeBufferGeometry<ConeBufferGeometry> {
  @Input() set args(v: ConstructorParameters<typeof ConeBufferGeometry>) {
    this.extraArgs = v;
  }

  geometryType = ConeBufferGeometry;
}
