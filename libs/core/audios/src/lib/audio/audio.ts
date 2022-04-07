// GENERATED
import {
    AnyConstructor,
    NgtCommonAudio,
    provideCommonAudioFactory,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-audio',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonAudioFactory<GainNode, THREE.Audio>(NgtAudio)],
})
export class NgtAudio extends NgtCommonAudio<GainNode, THREE.Audio> {
    override get audioType(): AnyConstructor<THREE.Audio> {
        return THREE.Audio;
    }
}

@NgModule({
    declarations: [NgtAudio],
    exports: [NgtAudio],
})
export class NgtAudioModule {}
