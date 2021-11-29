// GENERATED
import { NgtMaterial } from '@angular-three/core';
import { NgModule, Directive } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-mesh-matcap-material',
  exportAs: 'ngt',
  providers: [
    {
      provide: NgtMaterial,
      useExisting: NgtMeshMatcapMaterial,
    },
  ],
})
export class NgtMeshMatcapMaterial extends NgtMaterial<
  THREE.MeshMatcapMaterialParameters,
  THREE.MeshMatcapMaterial
> {
  static ngAcceptInputType_parameters:
    | THREE.MeshMatcapMaterialParameters
    | undefined;

  materialType = THREE.MeshMatcapMaterial;
}

@NgModule({
  declarations: [NgtMeshMatcapMaterial],
  exports: [NgtMeshMatcapMaterial],
})
export class NgtMeshMatcapMaterialModule {}
