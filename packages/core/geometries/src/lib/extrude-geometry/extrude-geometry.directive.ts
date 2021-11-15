// GENERATED
import { NgtGeometry } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-extrude-geometry',
  exportAs: 'ngtExtrudeGeometry',
  providers: [
    {
      provide: NgtGeometry,
      useExisting: NgtExtrudeGeometry,
    },
  ],
})
export class NgtExtrudeGeometry extends NgtGeometry<THREE.ExtrudeGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.ExtrudeGeometry>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.ExtrudeGeometry>) {
    this.extraArgs = v;
  }

  geometryType = THREE.ExtrudeGeometry;
}
