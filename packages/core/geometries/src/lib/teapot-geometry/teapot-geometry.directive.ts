// GENERATED
import { NgtGeometry } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { TeapotGeometry } from 'three/examples/jsm/geometries/TeapotGeometry';

@Directive({
  selector: 'ngt-teapot-geometry',
  exportAs: 'ngtTeapotGeometry',
  providers: [
    {
      provide: NgtGeometry,
      useExisting: NgtTeapotGeometry,
    },
  ],
})
export class NgtTeapotGeometry extends NgtGeometry<TeapotGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof TeapotGeometry>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof TeapotGeometry>) {
    this.extraArgs = v;
  }

  geometryType = TeapotGeometry;
}
