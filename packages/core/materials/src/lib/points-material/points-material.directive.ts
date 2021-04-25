// GENERATED

import { ThreeMaterial } from '@angular-three/core';
import { Directive } from '@angular/core';
import { PointsMaterial, PointsMaterialParameters } from 'three';

@Directive({
  selector: 'ngt-pointsMaterial',
  exportAs: 'ngtPointsMaterial',
  providers: [{ provide: ThreeMaterial, useExisting: PointsMaterialDirective }],
})
export class PointsMaterialDirective extends ThreeMaterial<
  PointsMaterial,
  PointsMaterialParameters
> {
  static ngAcceptInputType_parameters: PointsMaterialParameters | undefined;

  materialType = PointsMaterial;
}
