// GENERATED
import { NGT_OBJECT_PROVIDER, NgtMaterial } from '@angular-three/core';
import { NgModule, Directive } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-points-material',
  exportAs: 'ngtPointsMaterial',
  providers: [
    {
      provide: NgtMaterial,
      useExisting: NgtPointsMaterial,
    },
    NGT_OBJECT_PROVIDER,
  ],
})
export class NgtPointsMaterial extends NgtMaterial<
  THREE.PointsMaterialParameters,
  THREE.PointsMaterial
> {
  static ngAcceptInputType_parameters:
    | THREE.PointsMaterialParameters
    | undefined;

  materialType = THREE.PointsMaterial;
}

@NgModule({
  declarations: [NgtPointsMaterial],
  exports: [NgtPointsMaterial],
})
export class NgtPointsMaterialModule {}
