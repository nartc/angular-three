// GENERATED

import { ThreeMaterial } from '@angular-three/core';
import { Directive } from '@angular/core';
import { MeshPhysicalMaterial, MeshPhysicalMaterialParameters } from 'three';

@Directive({
  selector: 'ngt-mesh-physical-material',
  exportAs: 'ngtMeshPhysicalMaterial',
  providers: [
    { provide: ThreeMaterial, useExisting: MeshPhysicalMaterialDirective },
  ],
})
export class MeshPhysicalMaterialDirective extends ThreeMaterial<
  MeshPhysicalMaterial,
  MeshPhysicalMaterialParameters
> {
  static ngAcceptInputType_parameters:
    | MeshPhysicalMaterialParameters
    | undefined;

  materialType = MeshPhysicalMaterial;
}
