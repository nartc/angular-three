// GENERATED
import { NgtMaterial } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-line-dashed-material',
  exportAs: 'ngtLineDashedMaterial',
  providers: [
    {
      provide: NgtMaterial,
      useExisting: NgtLineDashedMaterial,
    }
  ],
})
export class NgtLineDashedMaterial extends NgtMaterial<THREE.LineDashedMaterial, THREE.LineDashedMaterialParameters> {
  
  static ngAcceptInputType_parameters: THREE.LineDashedMaterialParameters | undefined;

  materialType = THREE.LineDashedMaterial;
}
