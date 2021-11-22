// GENERATED

import { NgtCommonAudio, NgtObject3d, NGT_OBJECT_3D_CONTROLLER_PROVIDER } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-positional-audio',
  exportAs: 'ngtPositionalAudio',
  providers: [
    {
      provide: NgtCommonAudio,
      useExisting: NgtPositionalAudio,
    },
    {
      provide: NgtObject3d,
      useExisting: NgtPositionalAudio,
    },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtPositionalAudio extends NgtCommonAudio<THREE.PositionalAudio> {
  

  audioType = THREE.PositionalAudio;
}
