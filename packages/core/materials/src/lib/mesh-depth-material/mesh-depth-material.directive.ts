// GENERATED

import { ThreeMaterial } from '@angular-three/core';
import { Directive } from '@angular/core';
import { MeshDepthMaterial, MeshDepthMaterialParameters } from 'three';

@Directive({
  selector: 'ngt-mesh-depth-material',
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
