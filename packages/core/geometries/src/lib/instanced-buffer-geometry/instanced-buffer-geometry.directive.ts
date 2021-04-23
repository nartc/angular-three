// GENERATED

import { Directive, Input } from '@angular/core';
import { InstancedBufferGeometry } from 'three';
import { ThreeBufferGeometry } from '../abstracts';

@Directive({
  selector: 'ngt-instancedBufferGeometry,ngt-instancedGeometry',
  exportAs: 'ngtInstancedBufferGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: InstancedBufferGeometryDirective,
    },
  ],
})
export class InstancedBufferGeometryDirective extends ThreeBufferGeometry<InstancedBufferGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof InstancedBufferGeometry> | undefined;

  @Input() set args(v: ConstructorParameters<typeof InstancedBufferGeometry>) {
    this.extraArgs = v;
  }

  geometryType = InstancedBufferGeometry;
}
