import { Directive, Input } from '@angular/core';
import { BoxBufferGeometry } from 'three';
import { ThreeBufferGeometry } from '../abstracts';

@Directive({
  selector: 'ngt-boxBufferGeometry',
  exportAs: 'ngtBoxBufferGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: BoxBufferGeometryDirective,
    },
  ],
})
export class BoxBufferGeometryDirective extends ThreeBufferGeometry<BoxBufferGeometry> {
  @Input() set args(v: ConstructorParameters<typeof BoxBufferGeometry>) {
    this.extraArgs = v;
  }

  geometryType = BoxBufferGeometry;
}
