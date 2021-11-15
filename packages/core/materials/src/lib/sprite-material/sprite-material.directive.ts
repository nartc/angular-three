// GENERATED
import { NgtMaterial } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-sprite-material',
  exportAs: 'ngtSpriteMaterial',
  providers: [
    {
      provide: NgtMaterial,
      useExisting: NgtSpriteMaterial,
    },
  ],
})
export class NgtSpriteMaterial extends NgtMaterial<
  THREE.SpriteMaterial,
  THREE.SpriteMaterialParameters
> {
  static ngAcceptInputType_parameters:
    | THREE.SpriteMaterialParameters
    | undefined;

  materialType = THREE.SpriteMaterial;
}
