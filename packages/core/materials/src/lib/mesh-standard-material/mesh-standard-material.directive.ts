// GENERATED
import { NgtMaterial } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-mesh-standard-material',
  exportAs: 'ngtMeshStandardMaterial',
  providers: [
    {
      provide: NgtMaterial,
      useExisting: NgtMeshStandardMaterial,
    },
  ],
})
export class NgtMeshStandardMaterial extends NgtMaterial<
  THREE.MeshStandardMaterial,
  THREE.MeshStandardMaterialParameters
> {
  static ngAcceptInputType_parameters:
    | THREE.MeshStandardMaterialParameters
    | undefined;

  materialType = THREE.MeshStandardMaterial;
}
