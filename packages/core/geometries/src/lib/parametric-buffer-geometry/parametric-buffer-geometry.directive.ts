import { Directive, Input } from '@angular/core';
import { ParametricBufferGeometry } from 'three';
import { ThreeBufferGeometry } from '../abstracts';

@Directive({
  selector: 'ngt-parametricBufferGeometry',
  exportAs: 'ngtParametricBufferGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: ParametricBufferGeometryDirective,
    },
  ],
})
export class ParametricBufferGeometryDirective extends ThreeBufferGeometry<ParametricBufferGeometry> {
  @Input() set args(v: ConstructorParameters<typeof ParametricBufferGeometry>) {
    this.extraArgs = v;
  }

  geometryType = ParametricBufferGeometry;
}
