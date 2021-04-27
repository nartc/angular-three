// GENERATED

import { ThreeMaterial } from '@angular-three/core';
import { Directive } from '@angular/core';
import { LineDashedMaterial, LineDashedMaterialParameters } from 'three';

@Directive({
  selector: 'ngt-line-dashed-material',
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
