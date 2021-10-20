// GENERATED
import { ThreeBufferGeometry } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

@Directive({
  selector: 'ngt-text-geometry',
  exportAs: 'ngtTextGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: TextGeometryDirective,
    },
  ],
})
export class TextGeometryDirective extends ThreeBufferGeometry<TextGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof TextGeometry>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof TextGeometry>) {
    this.extraArgs = v;
  }

  geometryType = TextGeometry;
}
