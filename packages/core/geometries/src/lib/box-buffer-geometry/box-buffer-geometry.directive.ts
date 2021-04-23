// GENERATED

import { Directive, Input } from '@angular/core';
import { BoxBufferGeometry } from 'three';
import { ThreeBufferGeometry } from '../abstracts';

@Directive({
  selector: 'ngt-boxBufferGeometry,ngt-boxGeometry',
  exportAs: 'ngtBoxBufferGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: BoxBufferGeometryDirective,
    },
  ],
})
export class BoxBufferGeometryDirective extends ThreeBufferGeometry<BoxBufferGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof BoxBufferGeometry> | undefined;

  @Input() set args(v: ConstructorParameters<typeof BoxBufferGeometry>) {
    this.extraArgs = v;
  }

  geometryType = BoxBufferGeometry;
}
