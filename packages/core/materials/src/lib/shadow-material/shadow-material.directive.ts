// GENERATED

import { ThreeMaterial } from '@angular-three/core';
import { Directive } from '@angular/core';
import { ShadowMaterial, ShadowMaterialParameters } from 'three';

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
