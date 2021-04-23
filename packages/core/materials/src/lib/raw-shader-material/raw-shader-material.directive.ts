// GENERATED

import { Directive } from '@angular/core';
import { RawShaderMaterial, ShaderMaterialParameters } from 'three';
import { ThreeMaterial } from '../abstracts';

@Directive({
  selector: 'ngt-rawShaderMaterial',
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
