// GENERATED

import { NgtMaterial } from '@angular-three/core';
import { NgModule, Directive } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-mesh-toon-material',
  exportAs: 'ngt',
  providers: [
    {
      provide: NgtMaterial,
      useExisting: NgtMeshToonMaterial,
    },
  ],
})
export class NgtMeshToonMaterial extends NgtMaterial<
  THREE.MeshToonMaterialParameters,
  THREE.MeshToonMaterial
> {
  static ngAcceptInputType_parameters:
    | THREE.MeshToonMaterialParameters
    | undefined;

  materialType = THREE.MeshToonMaterial;
}

@NgModule({
  declarations: [NgtMeshToonMaterial],
  exports: [NgtMeshToonMaterial],
})
export class NgtMeshToonMaterialModule {}
