// GENERATED
import { NgtMaterial } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-mesh-lambert-material',
  exportAs: 'ngtMeshLambertMaterial',
  providers: [
    {
      provide: NgtMaterial,
      useExisting: NgtMeshLambertMaterial,
    },
  ],
})
export class NgtMeshLambertMaterial extends NgtMaterial<THREE.MeshLambertMaterial, THREE.MeshLambertMaterialParameters> {
  
  static ngAcceptInputType_parameters: THREE.MeshLambertMaterialParameters | undefined;

  materialType = THREE.MeshLambertMaterial;
}
