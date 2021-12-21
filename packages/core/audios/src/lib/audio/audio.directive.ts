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
  selector: 'ngt-audio',
  exportAs: 'ngtAudio',
  providers: [
    {
      provide: NgtCommonAudio,
      useExisting: NgtAudio,
    },
    NGT_AUDIO_CONTROLLER_PROVIDER,
    NGT_OBJECT_CONTROLLER_PROVIDER,
  ],
})
export class NgtAudio extends NgtCommonAudio<GainNode, THREE.Audio> {
  audioType = THREE.Audio;
}

@NgModule({
  declarations: [NgtAudio],
  exports: [NgtAudio, NgtAudioControllerModule, NgtObject3dControllerModule],
})
export class NgtAudioModule {}
