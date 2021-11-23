// GENERATED

import {
  NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  NgtCommonAudio,
  NgtObject3d,
} from '@angular-three/core';
import { Directive, NgModule } from '@angular/core';
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
export class NgtPositionalAudio extends NgtCommonAudio<
  PannerNode,
  THREE.PositionalAudio
> {
  audioType = THREE.PositionalAudio;
}

@NgModule({
  declarations: [NgtPositionalAudio],
  exports: [NgtPositionalAudio],
})
export class NgtPositionalAudioModule {}
