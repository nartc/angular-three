// GENERATED

import { Directive, Input } from '@angular/core';
import { TextBufferGeometry } from 'three';
import { ThreeBufferGeometry } from '../abstracts';

@Directive({
  selector: 'ngt-textBufferGeometry,ngt-textGeometry',
  exportAs: 'ngtTextBufferGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: TextBufferGeometryDirective,
    },
  ],
})
export class TextBufferGeometryDirective extends ThreeBufferGeometry<TextBufferGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof TextBufferGeometry>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof TextBufferGeometry>) {
    this.extraArgs = v;
  }

  geometryType = TextBufferGeometry;
}
