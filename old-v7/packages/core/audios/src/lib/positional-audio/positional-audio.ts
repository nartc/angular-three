// GENERATED - AngularThree v7.0.0
import { NgtAnyConstructor, NgtCommonAudio, provideCommonAudioRef, provideNgtCommonAudio } from '@angular-three/core';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-positional-audio',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonAudio(NgtPositionalAudio), provideCommonAudioRef(NgtPositionalAudio)],
})
export class NgtPositionalAudio extends NgtCommonAudio<PannerNode, THREE.PositionalAudio> {
  override get audioType(): NgtAnyConstructor<THREE.PositionalAudio> {
    return THREE.PositionalAudio;
  }
}
