import { NgtObject, NgtObjectState } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

export interface NgtAudioListenerState
    extends NgtObjectState<THREE.AudioListener> {
    filter: AudioNode;
    timeDelta: number;
}

@Component({
    selector: 'ngt-audio-listener',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgtAudioListener extends NgtObject<
    THREE.AudioListener,
    NgtAudioListenerState
> {
    protected override objectInitFn(): THREE.AudioListener {
        this.set({ appendMode: 'none' });

        const { filter, timeDelta } = this.get();

        const audioListener = new THREE.AudioListener();

        if (filter != null) {
            audioListener.filter = filter;
        }

        if (timeDelta != null) {
            audioListener.timeDelta = timeDelta;
        }

        const camera = this.store.get((s) => s.camera);
        if (camera) {
            camera.add(audioListener);
        }

        return audioListener;
    }

    override ngOnInit() {
        this.init();
        super.ngOnInit();
    }

    protected override destroy() {
        super.destroy();
        const camera = this.store.get((s) => s.camera);
        if (camera) {
            camera.remove(this.object3d);
        }
    }

    protected override get subInputs(): Record<string, boolean> {
        return { filter: true, timeDelta: true };
    }
}

@NgModule({
    declarations: [NgtAudioListener],
    exports: [NgtAudioListener],
})
export class NgtAudioListenerModule {}
