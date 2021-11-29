// GENERATED
import { NgtMaterial } from '@angular-three/core';
import { NgModule, Directive } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-line-basic-material',
  exportAs: 'ngt',
  providers: [
    {
      provide: NgtMaterial,
      useExisting: NgtLineBasicMaterial,
    },
  ],
})
export class NgtLineBasicMaterial extends NgtMaterial<
  THREE.LineBasicMaterialParameters,
  THREE.LineBasicMaterial
> {
  static ngAcceptInputType_parameters:
    | THREE.LineBasicMaterialParameters
    | undefined;

  materialType = THREE.LineBasicMaterial;
}

@NgModule({
  declarations: [NgtLineBasicMaterial],
  exports: [NgtLineBasicMaterial],
})
export class NgtLineBasicMaterialModule {}
