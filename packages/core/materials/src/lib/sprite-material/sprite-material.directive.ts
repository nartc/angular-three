// GENERATED

import { Directive } from '@angular/core';
import { SpriteMaterial, SpriteMaterialParameters } from 'three';
import { ThreeMaterial } from '../abstracts';

@Directive({
  selector: 'ngt-spriteMaterial',
  exportAs: 'ngtSpriteMaterial',
  providers: [
    { provide: ThreeMaterial, useExisting: SpriteMaterialDirective },
  ],
})
export class SpriteMaterialDirective extends ThreeMaterial<
  SpriteMaterial,
  SpriteMaterialParameters
> {
  static ngAcceptInputType_parameters: SpriteMaterialParameters | undefined;

  materialType = SpriteMaterial;
}
