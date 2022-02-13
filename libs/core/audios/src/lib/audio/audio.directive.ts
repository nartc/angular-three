// GENERATED
import {
    createParentObjectProvider,
    NGT_AUDIO_CONTROLLER_PROVIDER,
    NGT_OBJECT_CONTROLLER_PROVIDER,
    NgtAudioControllerModule,
    NgtCommonAudio,
    NgtObjectControllerModule,
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
        createParentObjectProvider(NgtAudio, (parent) => parent.audio),
    ],
})
export class NgtAudio extends NgtCommonAudio<GainNode, THREE.Audio> {
    audioType = THREE.Audio;
}

@NgModule({
    declarations: [NgtAudio],
    exports: [NgtAudio, NgtAudioControllerModule, NgtObjectControllerModule],
})
export class NgtAudioModule {}
