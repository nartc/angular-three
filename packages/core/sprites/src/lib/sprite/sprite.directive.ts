// GENERATED

import {
  NgtCommonSprite,
  NgtObject3d,
  NGT_OBJECT_3D_CONTROLLER_PROVIDER,
} from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-sprite',
  exportAs: 'ngtSprite',
  providers: [
    {
      provide: NgtObject3d,
      useExisting: NgtSprite,
    },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtSprite extends NgtCommonSprite<THREE.Sprite> {
  spriteType = THREE.Sprite;
}
