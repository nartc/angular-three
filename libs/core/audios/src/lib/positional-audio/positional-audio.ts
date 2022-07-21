// GENERATED
import { AnyConstructor, NgtCommonAudio, provideCommonAudioRef } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three/src/Three';

@Component({
  selector: 'ngt-positional-audio',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonAudioRef(NgtPositionalAudio)],
})
export class NgtPositionalAudio extends NgtCommonAudio<PannerNode, THREE.PositionalAudio> {
  override get audioType(): AnyConstructor<THREE.PositionalAudio> {
    return THREE.PositionalAudio;
  }
}

@NgModule({
  imports: [NgtPositionalAudio],
  exports: [NgtPositionalAudio],
})
export class NgtPositionalAudioModule {}
