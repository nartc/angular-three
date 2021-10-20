// GENERATED
import { ThreeBufferGeometry } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry';

@Directive({
  selector: 'ngt-parametric-geometry',
  exportAs: 'ngtParametricGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: ParametricGeometryDirective,
    },
  ],
})
export class ParametricGeometryDirective extends ThreeBufferGeometry<ParametricGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof ParametricGeometry>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof ParametricGeometry>) {
    this.extraArgs = v;
  }

  geometryType = ParametricGeometry;
}
