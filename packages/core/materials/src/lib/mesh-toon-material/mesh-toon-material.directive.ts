// GENERATED

import { ThreeMaterial } from '@angular-three/core';
import { Directive } from '@angular/core';
import { MeshToonMaterial, MeshToonMaterialParameters } from 'three';

@Directive({
  selector: 'ngt-mesh-toon-material',
  exportAs: 'ngtMeshToonMaterial',
  providers: [
    { provide: ThreeMaterial, useExisting: MeshToonMaterialDirective },
  ],
})
export class MeshToonMaterialDirective extends ThreeMaterial<
  MeshToonMaterial,
  MeshToonMaterialParameters
> {
  static ngAcceptInputType_parameters: MeshToonMaterialParameters | undefined;

  materialType = MeshToonMaterial;
}
