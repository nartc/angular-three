// GENERATED
import {
    AnyConstructor,
    NgtCommonAudio,
    provideNgtCommonAudio,
    provideCommonAudioRef,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-positional-audio',
    standalone: true,
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideNgtCommonAudio(NgtPositionalAudio),
        provideCommonAudioRef(NgtPositionalAudio)
    ],
})
export class NgtPositionalAudio extends NgtCommonAudio<PannerNode, THREE.PositionalAudio> {
    override get audioType(): AnyConstructor<THREE.PositionalAudio> {
        return THREE.PositionalAudio;
    }
}
