// GENERATED
import { NgtGeometry } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-icosahedron-geometry',
  exportAs: 'ngtIcosahedronGeometry',
  providers: [
    {
      provide: NgtGeometry,
      useExisting: NgtIcosahedronGeometry,
    },
  ],
})
export class NgtIcosahedronGeometry extends NgtGeometry<THREE.IcosahedronGeometry> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.IcosahedronGeometry> | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.IcosahedronGeometry>) {
    this.extraArgs = v;
  }

  geometryType = THREE.IcosahedronGeometry;
}
