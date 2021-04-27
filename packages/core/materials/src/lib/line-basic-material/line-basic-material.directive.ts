// GENERATED

import { ThreeMaterial } from '@angular-three/core';
import { Directive } from '@angular/core';
import { LineBasicMaterial, LineBasicMaterialParameters } from 'three';

@Directive({
  selector: 'ngt-line-basic-material',
  exportAs: 'ngtLineBasicMaterial',
  providers: [
    { provide: ThreeMaterial, useExisting: LineBasicMaterialDirective },
  ],
})
export class LineBasicMaterialDirective extends ThreeMaterial<
  LineBasicMaterial,
  LineBasicMaterialParameters
> {
  static ngAcceptInputType_parameters: LineBasicMaterialParameters | undefined;

  materialType = LineBasicMaterial;
}
