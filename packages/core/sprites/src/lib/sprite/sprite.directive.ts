// GENERATED

import {
  ThreeSprite,
  ThreeObject3d,
  OBJECT_3D_CONTROLLER_PROVIDER,
} from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { Sprite } from 'three';

@Directive({
  selector: 'ngt-sprite',
  exportAs: 'ngtSprite',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: SpriteDirective,
    },
    OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class SpriteDirective extends ThreeSprite<Sprite> {
  spriteType = Sprite;
}
