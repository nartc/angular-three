// GENERATED
import { NgtMaterial } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-mesh-toon-material',
  exportAs: 'ngtMeshToonMaterial',
  providers: [
    {
      provide: NgtMaterial,
      useExisting: NgtMeshToonMaterial,
    },
  ],
})
export class NgtMeshToonMaterial extends NgtMaterial<THREE.MeshToonMaterial, THREE.MeshToonMaterialParameters> {
  
  static ngAcceptInputType_parameters: THREE.MeshToonMaterialParameters | undefined;

  materialType = THREE.MeshToonMaterial;
}
