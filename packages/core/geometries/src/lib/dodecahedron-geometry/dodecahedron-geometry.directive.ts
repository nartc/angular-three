// GENERATED
import { NgtGeometry } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-dodecahedron-geometry',
  exportAs: 'ngtDodecahedronGeometry',
  providers: [
    {
      provide: NgtGeometry,
      useExisting: NgtDodecahedronGeometry,
    }
  ],
})
export class NgtDodecahedronGeometry extends NgtGeometry<THREE.DodecahedronGeometry> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.DodecahedronGeometry> | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.DodecahedronGeometry>) {
    this.extraArgs = v;
  }

  geometryType = THREE.DodecahedronGeometry;
}
