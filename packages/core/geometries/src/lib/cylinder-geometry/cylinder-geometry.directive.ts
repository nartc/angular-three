// GENERATED
import { NgtGeometry } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-cylinder-geometry',
  exportAs: 'ngtCylinderGeometry',
  providers: [
    {
      provide: NgtGeometry,
      useExisting: NgtCylinderGeometry,
    }
  ],
})
export class NgtCylinderGeometry extends NgtGeometry<THREE.CylinderGeometry> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.CylinderGeometry> | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.CylinderGeometry>) {
    this.extraArgs = v;
  }

  geometryType = THREE.CylinderGeometry;
}
