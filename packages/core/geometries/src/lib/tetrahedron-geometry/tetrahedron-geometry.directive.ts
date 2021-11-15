// GENERATED
import { NgtGeometry } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-tetrahedron-geometry',
  exportAs: 'ngtTetrahedronGeometry',
  providers: [
    {
      provide: NgtGeometry,
      useExisting: NgtTetrahedronGeometry,
    },
  ],
})
export class NgtTetrahedronGeometry extends NgtGeometry<THREE.TetrahedronGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.TetrahedronGeometry>
    | undefined;

  @Input() set args(
    v: ConstructorParameters<typeof THREE.TetrahedronGeometry>
  ) {
    this.extraArgs = v;
  }

  geometryType = THREE.TetrahedronGeometry;
}
