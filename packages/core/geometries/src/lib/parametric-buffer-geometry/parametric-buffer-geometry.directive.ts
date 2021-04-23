// GENERATED

import { Directive, Input } from '@angular/core';
import { ParametricBufferGeometry } from 'three';
import { ThreeBufferGeometry } from '../abstracts';

@Directive({
  selector: 'ngt-parametricBufferGeometry,ngt-parametricGeometry',
  exportAs: 'ngtParametricBufferGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: ParametricBufferGeometryDirective,
    },
  ],
})
export class ParametricBufferGeometryDirective extends ThreeBufferGeometry<ParametricBufferGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof ParametricBufferGeometry> | undefined;

  @Input() set args(v: ConstructorParameters<typeof ParametricBufferGeometry>) {
    this.extraArgs = v;
  }

  geometryType = ParametricBufferGeometry;
}
