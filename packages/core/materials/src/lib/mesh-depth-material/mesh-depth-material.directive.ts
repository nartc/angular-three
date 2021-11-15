// GENERATED
import { NgtMaterial } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-mesh-depth-material',
  exportAs: 'ngtMeshDepthMaterial',
  providers: [
    {
      provide: NgtMaterial,
      useExisting: NgtMeshDepthMaterial,
    },
  ],
})
export class NgtMeshDepthMaterial extends NgtMaterial<THREE.MeshDepthMaterial, THREE.MeshDepthMaterialParameters> {
  
  static ngAcceptInputType_parameters: THREE.MeshDepthMaterialParameters | undefined;

  materialType = THREE.MeshDepthMaterial;
}
