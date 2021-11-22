// GENERATED

import { NgtCommonAudio, NgtObject3d, NGT_OBJECT_3D_CONTROLLER_PROVIDER } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-audio',
  exportAs: 'ngtAudio',
  providers: [
    {
      provide: NgtCommonAudio,
      useExisting: NgtAudio,
    },
    {
      provide: NgtObject3d,
      useExisting: NgtAudio,
    },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtAudio extends NgtCommonAudio<THREE.Audio> {
  

  audioType = THREE.Audio;
}
