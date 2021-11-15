// GENERATED
import { NgtMaterial } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-mesh-physical-material',
  exportAs: 'ngtMeshPhysicalMaterial',
  providers: [
    {
      provide: NgtMaterial,
      useExisting: NgtMeshPhysicalMaterial,
    },
  ],
})
export class NgtMeshPhysicalMaterial extends NgtMaterial<
  THREE.MeshPhysicalMaterial,
  THREE.MeshPhysicalMaterialParameters
> {
  static ngAcceptInputType_parameters:
    | THREE.MeshPhysicalMaterialParameters
    | undefined;

  materialType = THREE.MeshPhysicalMaterial;
}
