// GENERATED
import { NgtMaterial } from '@angular-three/core';
import { NgModule, Directive } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-mesh-lambert-material',
  exportAs: 'ngt',
  providers: [
    {
      provide: NgtMaterial,
      useExisting: NgtMeshLambertMaterial,
    },
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
