// GENERATED
import { NgtGeometry } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-octahedron-geometry',
  exportAs: 'ngtOctahedronGeometry',
  providers: [
    {
      provide: NgtGeometry,
      useExisting: NgtOctahedronGeometry,
    }
  ],
})
export class NgtOctahedronGeometry extends NgtGeometry<THREE.OctahedronGeometry> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.OctahedronGeometry> | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.OctahedronGeometry>) {
    this.extraArgs = v;
  }

  geometryType = THREE.OctahedronGeometry;
}
