// GENERATED
import { NgtMaterial } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-raw-shader-material',
  exportAs: 'ngtRawShaderMaterial',
  providers: [
    {
      provide: NgtMaterial,
      useExisting: NgtRawShaderMaterial,
    },
  ],
})
export class NgtRawShaderMaterial extends NgtMaterial<THREE.RawShaderMaterial, THREE.ShaderMaterialParameters> {
  
  static ngAcceptInputType_parameters: THREE.ShaderMaterialParameters | undefined;

  materialType = THREE.RawShaderMaterial;
}
