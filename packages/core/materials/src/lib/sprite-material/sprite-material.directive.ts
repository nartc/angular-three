// GENERATED
import { NgtMaterial } from '@angular-three/core';
import { NgModule, Directive } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-sprite-material',
  exportAs: 'ngt',
  providers: [
    {
      provide: NgtMaterial,
      useExisting: NgtSpriteMaterial,
    },
  ],
})
export class NgtSpriteMaterial extends NgtMaterial<
  THREE.SpriteMaterialParameters,
  THREE.SpriteMaterial
> {
  static ngAcceptInputType_parameters:
    | THREE.SpriteMaterialParameters
    | undefined;

  materialType = THREE.SpriteMaterial;
}

@NgModule({
  declarations: [NgtSpriteMaterial],
  exports: [NgtSpriteMaterial],
})
export class NgtSpriteMaterialModule {}
