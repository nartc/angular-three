// GENERATED

import { Directive } from '@angular/core';
import { LineDashedMaterial, LineDashedMaterialParameters } from 'three';
import { ThreeMaterial } from '../abstracts';

@Directive({
  selector: 'ngt-lineDashedMaterial',
  exportAs: 'ngtLineDashedMaterial',
  providers: [
    { provide: ThreeMaterial, useExisting: LineDashedMaterialDirective },
  ],
})
export class LineDashedMaterialDirective extends ThreeMaterial<
  LineDashedMaterial,
  LineDashedMaterialParameters
> {
  static ngAcceptInputType_parameters: LineDashedMaterialParameters | undefined;

  materialType = LineDashedMaterial;
}
