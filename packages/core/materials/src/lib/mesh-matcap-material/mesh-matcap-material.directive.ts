// GENERATED
import { NgtMaterial } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-mesh-matcap-material',
  exportAs: 'ngtMeshMatcapMaterial',
  providers: [
    {
      provide: NgtMaterial,
      useExisting: NgtMeshMatcapMaterial,
    },
  ],
})
export class NgtMeshMatcapMaterial extends NgtMaterial<THREE.MeshMatcapMaterial, THREE.MeshMatcapMaterialParameters> {
  
  static ngAcceptInputType_parameters: THREE.MeshMatcapMaterialParameters | undefined;

  materialType = THREE.MeshMatcapMaterial;
}
