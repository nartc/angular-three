// GENERATED
import {
  NGT_AUDIO_CONTROLLER_PROVIDER,
  NGT_OBJECT_CONTROLLER_PROVIDER,
  NgtAudioControllerModule,
  NgtCommonAudio,
  NgtObject3dControllerModule,
} from '@angular-three/core';
import { NgModule, Directive } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-positional-audio',
  exportAs: 'ngtPositionalAudio',
  providers: [
    {
      provide: NgtCommonAudio,
      useExisting: NgtPositionalAudio,
    },
    NGT_AUDIO_CONTROLLER_PROVIDER,
    NGT_OBJECT_CONTROLLER_PROVIDER,
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
  exports: [
    NgtPositionalAudio,
    NgtAudioControllerModule,
    NgtObject3dControllerModule,
  ],
})
export class NgtPositionalAudioModule {}
