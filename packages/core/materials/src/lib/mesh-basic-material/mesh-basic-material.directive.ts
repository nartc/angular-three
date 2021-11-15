// GENERATED
import { NgtMaterial } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-mesh-basic-material',
  exportAs: 'ngtMeshBasicMaterial',
  providers: [
    {
      provide: NgtMaterial,
      useExisting: NgtMeshBasicMaterial,
    },
  ],
})
export class NgtMeshBasicMaterial extends NgtMaterial<
  THREE.MeshBasicMaterial,
  THREE.MeshBasicMaterialParameters
> {
  static ngAcceptInputType_parameters:
    | THREE.MeshBasicMaterialParameters
    | undefined;

  materialType = THREE.MeshBasicMaterial;
}
