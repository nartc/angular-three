// GENERATED
import { NGT_OBJECT_3D_PROVIDER, NgtMaterial } from '@angular-three/core';
import { NgModule, Directive } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-shadow-material',
  exportAs: 'ngtShadowMaterial',
  providers: [
    {
      provide: NgtMaterial,
      useExisting: NgtShadowMaterial,
    },
    NGT_OBJECT_3D_PROVIDER,
  ],
})
export class NgtShadowMaterial extends NgtMaterial<
  THREE.ShadowMaterialParameters,
  THREE.ShadowMaterial
> {
  static ngAcceptInputType_parameters:
    | THREE.ShadowMaterialParameters
    | undefined;

  materialType = THREE.ShadowMaterial;
}

@NgModule({
  declarations: [NgtShadowMaterial],
  exports: [NgtShadowMaterial],
})
export class NgtShadowMaterialModule {}
