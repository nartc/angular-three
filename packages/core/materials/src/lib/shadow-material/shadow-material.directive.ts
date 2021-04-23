// GENERATED

import { Directive } from '@angular/core';
import { ShadowMaterial, ShadowMaterialParameters } from 'three';
import { ThreeMaterial } from '../abstracts';

@Directive({
  selector: 'ngt-shadowMaterial',
  exportAs: 'ngtShadowMaterial',
  providers: [{ provide: ThreeMaterial, useExisting: ShadowMaterialDirective }],
})
export class ShadowMaterialDirective extends ThreeMaterial<
  ShadowMaterial,
  ShadowMaterialParameters
> {
  static ngAcceptInputType_parameters: ShadowMaterialParameters | undefined;

  materialType = ShadowMaterial;
}
