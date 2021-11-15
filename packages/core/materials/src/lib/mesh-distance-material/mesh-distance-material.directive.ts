// GENERATED
import { NgtMaterial } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-mesh-distance-material',
  exportAs: 'ngtMeshDistanceMaterial',
  providers: [
    {
      provide: NgtMaterial,
      useExisting: NgtMeshDistanceMaterial,
    },
  ],
})
export class NgtMeshDistanceMaterial extends NgtMaterial<THREE.MeshDistanceMaterial, THREE.MeshDistanceMaterialParameters> {
  
  static ngAcceptInputType_parameters: THREE.MeshDistanceMaterialParameters | undefined;

  materialType = THREE.MeshDistanceMaterial;
}
