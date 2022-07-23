// GENERATED
import { AnyConstructor, NgtCommonAudio, provideNgtCommonAudio, provideCommonAudioRef } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-audio',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgtCommonAudio(NgtAudio), provideCommonAudioRef(NgtAudio)],
})
export class NgtAudio extends NgtCommonAudio<GainNode, THREE.Audio> {
  override get audioType(): AnyConstructor<THREE.Audio> {
    return THREE.Audio;
  }
}

@NgModule({
  imports: [NgtAudio],
  exports: [NgtAudio],
})
export class NgtAudioModule {}
