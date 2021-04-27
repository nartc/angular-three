// GENERATED

import { ThreeMaterial } from '@angular-three/core';
import { Directive } from '@angular/core';
import { RawShaderMaterial, ShaderMaterialParameters } from 'three';

@Directive({
  selector: 'ngt-raw-shader-material',
  exportAs: 'ngtRawShaderMaterial',
  providers: [
    { provide: ThreeMaterial, useExisting: RawShaderMaterialDirective },
  ],
})
export class RawShaderMaterialDirective extends ThreeMaterial<
  RawShaderMaterial,
  ShaderMaterialParameters
> {
  static ngAcceptInputType_parameters: ShaderMaterialParameters | undefined;

  materialType = RawShaderMaterial;
}
