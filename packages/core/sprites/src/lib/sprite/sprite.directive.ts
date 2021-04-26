import { ThreeObject3d, ThreeSprite } from '@angular-three/core';
import { Directive } from '@angular/core';
import { Sprite } from 'three';

@Directive({
  selector: 'ngt-sprite',
  exportAs: 'ngtSprite',
  providers: [{ provide: ThreeObject3d, useExisting: SpriteDirective }],
})
export class SpriteDirective extends ThreeSprite {
  spriteType = Sprite;
}
