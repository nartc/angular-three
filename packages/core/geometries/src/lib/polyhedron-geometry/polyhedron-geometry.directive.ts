// GENERATED
import { NgtGeometry } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-polyhedron-geometry',
  exportAs: 'ngtPolyhedronGeometry',
  providers: [
    {
      provide: NgtGeometry,
      useExisting: NgtPolyhedronGeometry,
    },
  ],
})
export class NgtPolyhedronGeometry extends NgtGeometry<THREE.PolyhedronGeometry> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.PolyhedronGeometry> | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.PolyhedronGeometry>) {
    this.extraArgs = v;
  }

  geometryType = THREE.PolyhedronGeometry;
}
