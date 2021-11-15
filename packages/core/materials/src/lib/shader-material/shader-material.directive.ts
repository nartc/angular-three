// GENERATED
import { NgtMaterial } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-shader-material',
  exportAs: 'ngtShaderMaterial',
  providers: [
    {
      provide: NgtMaterial,
      useExisting: NgtShaderMaterial,
    },
  ],
})
export class NgtShaderMaterial extends NgtMaterial<THREE.ShaderMaterial, THREE.ShaderMaterialParameters> {
  
  static ngAcceptInputType_parameters: THREE.ShaderMaterialParameters | undefined;

  materialType = THREE.ShaderMaterial;
}
