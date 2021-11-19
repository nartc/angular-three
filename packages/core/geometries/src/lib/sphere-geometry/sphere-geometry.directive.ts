// GENERATED
import { NgtGeometry } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-sphere-geometry',
  exportAs: 'ngtSphereGeometry',
  providers: [
    {
      provide: NgtGeometry,
      useExisting: NgtSphereGeometry,
    }
  ],
})
export class NgtSphereGeometry extends NgtGeometry<THREE.SphereGeometry> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.SphereGeometry> | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.SphereGeometry>) {
    this.extraArgs = v;
  }

  geometryType = THREE.SphereGeometry;
}
