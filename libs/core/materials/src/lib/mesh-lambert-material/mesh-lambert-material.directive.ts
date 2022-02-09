// GENERATED
import { NGT_OBJECT_PROVIDER, NgtMaterial } from '@angular-three/core';
import { NgModule, Directive } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-mesh-lambert-material',
  exportAs: 'ngtMeshLambertMaterial',
  providers: [
    {
      provide: NgtMaterial,
      useExisting: NgtMeshLambertMaterial,
    },
    NGT_OBJECT_PROVIDER,
  ],
})
export class NgtMeshLambertMaterial extends NgtMaterial<
  THREE.MeshLambertMaterialParameters,
  THREE.MeshLambertMaterial
> {
  static ngAcceptInputType_parameters:
    | THREE.MeshLambertMaterialParameters
    | undefined;

  materialType = THREE.MeshLambertMaterial;
}

@NgModule({
  declarations: [NgtMeshLambertMaterial],
  exports: [NgtMeshLambertMaterial],
})
export class NgtMeshLambertMaterialModule {}
