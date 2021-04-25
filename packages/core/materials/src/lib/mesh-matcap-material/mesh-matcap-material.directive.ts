// GENERATED

import { ThreeMaterial } from '@angular-three/core';
import { Directive } from '@angular/core';
import { MeshMatcapMaterial, MeshMatcapMaterialParameters } from 'three';

@Directive({
  selector: 'ngt-meshMatcapMaterial',
  exportAs: 'ngtMeshMatcapMaterial',
  providers: [
    { provide: ThreeMaterial, useExisting: MeshMatcapMaterialDirective },
  ],
})
export class MeshMatcapMaterialDirective extends ThreeMaterial<
  MeshMatcapMaterial,
  MeshMatcapMaterialParameters
> {
  static ngAcceptInputType_parameters: MeshMatcapMaterialParameters | undefined;

  materialType = MeshMatcapMaterial;
}
