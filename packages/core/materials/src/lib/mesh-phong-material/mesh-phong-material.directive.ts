// GENERATED
import { NgtMaterial } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-mesh-phong-material',
  exportAs: 'ngtMeshPhongMaterial',
  providers: [
    {
      provide: NgtMaterial,
      useExisting: NgtMeshPhongMaterial,
    },
  ],
})
export class NgtMeshPhongMaterial extends NgtMaterial<
  THREE.MeshPhongMaterial,
  THREE.MeshPhongMaterialParameters
> {
  static ngAcceptInputType_parameters:
    | THREE.MeshPhongMaterialParameters
    | undefined;

  materialType = THREE.MeshPhongMaterial;
}
