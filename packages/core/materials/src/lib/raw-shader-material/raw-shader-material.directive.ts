// GENERATED
import { NgtMaterial } from '@angular-three/core';
import { NgModule, Directive } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-raw-shader-material',
  exportAs: 'ngt',
  providers: [
    {
      provide: NgtMaterial,
      useExisting: NgtRawShaderMaterial,
    },
  ],
})
export class NgtRawShaderMaterial extends NgtMaterial<
  THREE.ShaderMaterialParameters,
  THREE.RawShaderMaterial
> {
  static ngAcceptInputType_parameters:
    | THREE.ShaderMaterialParameters
    | undefined;

  materialType = THREE.RawShaderMaterial;
}

@NgModule({
  declarations: [NgtRawShaderMaterial],
  exports: [NgtRawShaderMaterial],
})
export class NgtRawShaderMaterialModule {}
