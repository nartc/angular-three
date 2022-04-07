// GENERATED
import {
    AnyConstructor,
    NgtCommonAudio,
    provideCommonAudioFactory,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-positional-audio',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonAudioFactory<PannerNode, THREE.PositionalAudio>(
            NgtPositionalAudio
        ),
    ],
})
export class NgtPositionalAudio extends NgtCommonAudio<
    PannerNode,
    THREE.PositionalAudio
> {
    override get audioType(): AnyConstructor<THREE.PositionalAudio> {
        return THREE.PositionalAudio;
    }
}

@NgModule({
    declarations: [NgtPositionalAudio],
    exports: [NgtPositionalAudio],
})
export class NgtPositionalAudioModule {}
