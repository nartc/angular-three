import { Directive, Input } from '@angular/core';
import { ExtrudeBufferGeometry } from 'three';
import { ThreeBufferGeometry } from '../abstracts';

@Directive({
  selector: 'ngt-extrudeBufferGeometry',
  exportAs: 'ngtExtrudeBufferGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: ExtrudeBufferGeometryDirective,
    },
  ],
})
export class ExtrudeBufferGeometryDirective extends ThreeBufferGeometry<ExtrudeBufferGeometry> {
  @Input() set args(v: ConstructorParameters<typeof ExtrudeBufferGeometry>) {
    this.extraArgs = v;
  }

  geometryType = ExtrudeBufferGeometry;
}
