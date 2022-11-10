// GENERATED - AngularThree v7.0.0
import { NgtAnyConstructor, NgtCommonAudio, provideNgtCommonAudio, provideCommonAudioRef } from '@angular-three/core';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-audio',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonAudio(NgtAudio), provideCommonAudioRef(NgtAudio)],
})
export class NgtAudio extends NgtCommonAudio<GainNode, THREE.Audio> {
  override get audioType(): NgtAnyConstructor<THREE.Audio> {
    return THREE.Audio;
  }
}
