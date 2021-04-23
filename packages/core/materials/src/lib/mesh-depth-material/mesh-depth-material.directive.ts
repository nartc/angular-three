// GENERATED

import { Directive } from '@angular/core';
import { MeshDepthMaterial, MeshDepthMaterialParameters } from 'three';
import { ThreeMaterial } from '../abstracts';

@Directive({
  selector: 'ngt-meshDepthMaterial',
  exportAs: 'ngtMeshDepthMaterial',
  providers: [
    { provide: ThreeMaterial, useExisting: MeshDepthMaterialDirective },
  ],
})
export class MeshDepthMaterialDirective extends ThreeMaterial<
  MeshDepthMaterial,
  MeshDepthMaterialParameters
> {
  static ngAcceptInputType_parameters: MeshDepthMaterialParameters | undefined;

  materialType = MeshDepthMaterial;
}
