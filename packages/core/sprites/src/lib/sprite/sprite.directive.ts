// GENERATED
import {
  NgtCommonSprite,
  NGT_OBJECT_CONTROLLER_PROVIDER,
  NgtObject3dControllerModule,
} from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-sprite',
  exportAs: 'ngtSprite',
  providers: [
    {
      provide: NgtCommonSprite,
      useExisting: NgtSprite,
    },
    NGT_OBJECT_CONTROLLER_PROVIDER,
  ],
})
export class NgtSprite extends NgtCommonSprite<THREE.Sprite> {
  spriteType = THREE.Sprite;
}

@NgModule({
  declarations: [NgtSprite],
  exports: [NgtSprite, NgtObject3dControllerModule],
})
export class NgtSpriteModule {}
