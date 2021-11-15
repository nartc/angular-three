// GENERATED
import { NgtMaterial } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-mesh-normal-material',
  exportAs: 'ngtMeshNormalMaterial',
  providers: [
    {
      provide: NgtMaterial,
      useExisting: NgtMeshNormalMaterial,
    },
  ],
})
export class NgtMeshNormalMaterial extends NgtMaterial<THREE.MeshNormalMaterial, THREE.MeshNormalMaterialParameters> {
  
  static ngAcceptInputType_parameters: THREE.MeshNormalMaterialParameters | undefined;

  materialType = THREE.MeshNormalMaterial;
}
