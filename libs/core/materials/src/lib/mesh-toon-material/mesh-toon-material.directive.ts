// GENERATED
import { NGT_OBJECT_PROVIDER, NgtMaterial } from '@angular-three/core';
import { NgModule, Directive } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-mesh-toon-material',
  exportAs: 'ngtMeshToonMaterial',
  providers: [
    {
      provide: NgtMaterial,
      useExisting: NgtMeshToonMaterial,
    },
    NGT_OBJECT_PROVIDER,
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