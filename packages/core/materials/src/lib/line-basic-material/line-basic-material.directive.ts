// GENERATED

import { Directive } from '@angular/core';
import { LineBasicMaterial, LineBasicMaterialParameters } from 'three';
import { ThreeMaterial } from '../abstracts';

@Directive({
  selector: 'ngt-lineBasicMaterial',
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
