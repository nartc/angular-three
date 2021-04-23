import { Directive, Input } from '@angular/core';
import { ShapeBufferGeometry } from 'three';
import { ThreeBufferGeometry } from '../abstracts';

@Directive({
  selector: 'ngt-shapeBufferGeometry',
  exportAs: 'ngtShapeBufferGeometry',
  providers: [
    { provide: ThreeBufferGeometry, useExisting: ShapeBufferGeometryDirective },
  ],
})
export class ShapeBufferGeometryDirective extends ThreeBufferGeometry<ShapeBufferGeometry> {
  @Input() set args(v: ConstructorParameters<typeof ShapeBufferGeometry>) {
    this.extraArgs = v;
  }

  geometryType = ShapeBufferGeometry;
}
