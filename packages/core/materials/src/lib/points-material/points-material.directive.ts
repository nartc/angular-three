// GENERATED
import { NgtMaterial } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-points-material',
  exportAs: 'ngtPointsMaterial',
  providers: [
    {
      provide: NgtMaterial,
      useExisting: NgtPointsMaterial,
    },
  ],
})
export class NgtPointsMaterial extends NgtMaterial<THREE.PointsMaterial, THREE.PointsMaterialParameters> {
  
  static ngAcceptInputType_parameters: THREE.PointsMaterialParameters | undefined;

  materialType = THREE.PointsMaterial;
}
