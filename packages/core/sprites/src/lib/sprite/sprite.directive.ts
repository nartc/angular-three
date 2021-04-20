import { ThreeObject3d } from '@angular-three/core';
import { Directive } from '@angular/core';
import { Sprite } from 'three';
import { ThreeSprite } from '../abstracts';

@Directive({
  selector: 'ngt-sprite',
  exportAs: 'ngtSprite',
  providers: [
    { provide: ThreeObject3d, useExisting: SpriteDirective, multi: true },
  ],
})
export class SpriteDirective extends ThreeSprite {
  spriteType = Sprite;
}
