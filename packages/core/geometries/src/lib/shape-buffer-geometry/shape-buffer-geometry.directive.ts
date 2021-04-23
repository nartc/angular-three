// GENERATED

import { Directive, Input } from '@angular/core';
import { ShapeBufferGeometry } from 'three';
import { ThreeBufferGeometry } from '../abstracts';

@Directive({
  selector: 'ngt-shapeBufferGeometry,ngt-shapeGeometry',
  exportAs: 'ngtShapeBufferGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: ShapeBufferGeometryDirective,
    },
  ],
})
export class ShapeBufferGeometryDirective extends ThreeBufferGeometry<ShapeBufferGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof ShapeBufferGeometry> | undefined;

  @Input() set args(v: ConstructorParameters<typeof ShapeBufferGeometry>) {
    this.extraArgs = v;
  }

  geometryType = ShapeBufferGeometry;
}
