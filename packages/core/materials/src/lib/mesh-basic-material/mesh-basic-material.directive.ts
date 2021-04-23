// GENERATED

import { Directive } from '@angular/core';
import { MeshBasicMaterial, MeshBasicMaterialParameters } from 'three';
import { ThreeMaterial } from '../abstracts';

@Directive({
  selector: 'ngt-meshBasicMaterial',
  exportAs: 'ngtMeshBasicMaterial',
  providers: [
    { provide: ThreeMaterial, useExisting: MeshBasicMaterialDirective },
  ],
})
export class MeshBasicMaterialDirective extends ThreeMaterial<
  MeshBasicMaterial,
  MeshBasicMaterialParameters
> {
  static ngAcceptInputType_parameters: MeshBasicMaterialParameters | undefined;

  materialType = MeshBasicMaterial;
}
