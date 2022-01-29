// GENERATED
import { NGT_OBJECT_3D_PROVIDER, NgtMaterial } from '@angular-three/core';
import { NgModule, Directive } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-mesh-physical-material',
  exportAs: 'ngtMeshPhysicalMaterial',
  providers: [
    {
      provide: NgtMaterial,
      useExisting: NgtMeshPhysicalMaterial,
    },
    NGT_OBJECT_3D_PROVIDER,
  ],
})
export class NgtMeshPhysicalMaterial extends NgtMaterial<
  THREE.MeshPhysicalMaterialParameters,
  THREE.MeshPhysicalMaterial
> {
  static ngAcceptInputType_parameters:
    | THREE.MeshPhysicalMaterialParameters
    | undefined;

  materialType = THREE.MeshPhysicalMaterial;
}

@NgModule({
  declarations: [NgtMeshPhysicalMaterial],
  exports: [NgtMeshPhysicalMaterial],
})
export class NgtMeshPhysicalMaterialModule {}
