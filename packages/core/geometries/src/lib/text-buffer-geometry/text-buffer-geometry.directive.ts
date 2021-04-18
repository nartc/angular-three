import { Directive, Input } from '@angular/core';
import { TextBufferGeometry, TextGeometry } from 'three';
import { ThreeBufferGeometry } from '../abstracts';

@Directive({
  selector: 'ngt-textBufferGeometry',
  exportAs: 'ngtTextBufferGeometry',
  providers: [
    { provide: ThreeBufferGeometry, useExisting: TextBufferGeometryDirective },
  ],
})
export class TextBufferGeometryDirective extends ThreeBufferGeometry<
  TextGeometry,
  any
> {
  @Input() set args(v: ConstructorParameters<typeof TextBufferGeometry>) {
    this.extraArgs = v;
  }

  geometryType = TextGeometry;
}
