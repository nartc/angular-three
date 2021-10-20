// GENERATED
import { ThreeBufferGeometry } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry';

@Directive({
  selector: 'ngt-box-line-geometry',
  exportAs: 'ngtBoxLineGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: BoxLineGeometryDirective,
    },
  ],
})
export class BoxLineGeometryDirective extends ThreeBufferGeometry<BoxLineGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof BoxLineGeometry>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof BoxLineGeometry>) {
    this.extraArgs = v;
  }

  geometryType = BoxLineGeometry;
}
