// GENERATED
import { NgtGeometry } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry';

@Directive({
  selector: 'ngt-box-line-geometry',
  exportAs: 'ngtBoxLineGeometry',
  providers: [
    {
      provide: NgtGeometry,
      useExisting: NgtBoxLineGeometry,
    },
  ],
})
export class NgtBoxLineGeometry extends NgtGeometry<BoxLineGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof BoxLineGeometry>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof BoxLineGeometry>) {
    this.extraArgs = v;
  }

  geometryType = BoxLineGeometry;
}
