// GENERATED
import { NGT_OBJECT_3D_PROVIDER, NgtMaterial } from '@angular-three/core';
import { NgModule, Directive } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-mesh-matcap-material',
  exportAs: 'ngtMeshMatcapMaterial',
  providers: [
    {
      provide: NgtMaterial,
      useExisting: NgtMeshMatcapMaterial,
    },
    NGT_OBJECT_3D_PROVIDER,
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
