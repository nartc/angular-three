// GENERATED

import { ThreeMaterial } from '@angular-three/core';
import { Directive } from '@angular/core';
import { SpriteMaterial, SpriteMaterialParameters } from 'three';

@Directive({
  selector: 'ngt-sprite-material',
  exportAs: 'ngtSpriteMaterial',
  providers: [{ provide: ThreeMaterial, useExisting: SpriteMaterialDirective }],
})
export class SpriteMaterialDirective extends ThreeMaterial<
  SpriteMaterial,
  SpriteMaterialParameters
> {
  static ngAcceptInputType_parameters: SpriteMaterialParameters | undefined;

  materialType = SpriteMaterial;
}
