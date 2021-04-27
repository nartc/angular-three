// GENERATED

import { ThreeMaterial } from '@angular-three/core';
import { Directive } from '@angular/core';
import { MeshNormalMaterial, MeshNormalMaterialParameters } from 'three';

@Directive({
  selector: 'ngt-mesh-normal-material',
  exportAs: 'ngtMeshNormalMaterial',
  providers: [
    { provide: ThreeMaterial, useExisting: MeshNormalMaterialDirective },
  ],
})
export class MeshNormalMaterialDirective extends ThreeMaterial<
  MeshNormalMaterial,
  MeshNormalMaterialParameters
> {
  static ngAcceptInputType_parameters: MeshNormalMaterialParameters | undefined;

  materialType = MeshNormalMaterial;
}
