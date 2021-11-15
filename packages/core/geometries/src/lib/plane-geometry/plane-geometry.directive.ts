// GENERATED
import { NgtGeometry } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-plane-geometry',
  exportAs: 'ngtPlaneGeometry',
  providers: [
    {
      provide: NgtGeometry,
      useExisting: NgtPlaneGeometry,
    },
  ],
})
export class NgtPlaneGeometry extends NgtGeometry<THREE.PlaneGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.PlaneGeometry>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.PlaneGeometry>) {
    this.extraArgs = v;
  }

  geometryType = THREE.PlaneGeometry;
}
