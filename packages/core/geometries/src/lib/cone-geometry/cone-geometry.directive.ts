// GENERATED
import { NgtGeometry } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-cone-geometry',
  exportAs: 'ngtConeGeometry',
  providers: [
    {
      provide: NgtGeometry,
      useExisting: NgtConeGeometry,
    }
  ],
})
export class NgtConeGeometry extends NgtGeometry<THREE.ConeGeometry> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.ConeGeometry> | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.ConeGeometry>) {
    this.extraArgs = v;
  }

  geometryType = THREE.ConeGeometry;
}
