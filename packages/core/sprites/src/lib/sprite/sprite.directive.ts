// GENERATED
import {
  NgtCommonSprite,
  NGT_OBJECT_CONTROLLER_PROVIDER,
  NgtObjectControllerModule,
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
  exports: [NgtSprite, NgtObjectControllerModule],
})
export class NgtSpriteModule {}
