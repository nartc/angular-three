import { Directive } from '@angular/core';
import { PointsMaterial, PointsMaterialParameters } from 'three';
import { ThreeMaterial } from '../abstracts';

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
