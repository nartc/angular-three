// GENERATED

import { Directive } from '@angular/core';
import { MeshMatcapMaterial, MeshMatcapMaterialParameters } from 'three';
import { ThreeMaterial } from '../abstracts';

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
