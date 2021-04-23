// GENERATED

import { Directive } from '@angular/core';
import { ShaderMaterial, ShaderMaterialParameters } from 'three';
import { ThreeMaterial } from '../abstracts';

@Directive({
  selector: 'ngt-shaderMaterial',
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
