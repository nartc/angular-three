// GENERATED

import { ThreeMaterial } from '@angular-three/core';
import { Directive } from '@angular/core';
import { ShaderMaterial, ShaderMaterialParameters } from 'three';

@Directive({
  selector: 'ngt-shader-material',
  exportAs: 'ngtShaderMaterial',
  providers: [{ provide: ThreeMaterial, useExisting: ShaderMaterialDirective }],
})
export class ShaderMaterialDirective extends ThreeMaterial<
  ShaderMaterial,
  ShaderMaterialParameters
> {
  static ngAcceptInputType_parameters: ShaderMaterialParameters | undefined;

  materialType = ShaderMaterial;
}
