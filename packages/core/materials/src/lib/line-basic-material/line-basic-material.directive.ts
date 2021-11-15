// GENERATED
import { NgtMaterial } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-line-basic-material',
  exportAs: 'ngtLineBasicMaterial',
  providers: [
    {
      provide: NgtMaterial,
      useExisting: NgtLineBasicMaterial,
    },
  ],
})
export class NgtLineBasicMaterial extends NgtMaterial<THREE.LineBasicMaterial, THREE.LineBasicMaterialParameters> {
  
  static ngAcceptInputType_parameters: THREE.LineBasicMaterialParameters | undefined;

  materialType = THREE.LineBasicMaterial;
}
