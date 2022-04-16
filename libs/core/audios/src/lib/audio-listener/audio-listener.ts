import {
    NgtObject,
    NgtObjectInputsState,
    NgtPreObjectInit,
    provideObjectRef,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

export interface NgtAudioListenerState
    extends NgtObjectInputsState<THREE.AudioListener> {
    filter: AudioNode;
    timeDelta: number;
}

@Component({
    selector: 'ngt-audio-listener',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideObjectRef(NgtAudioListener)],
})
export class NgtAudioListener extends NgtObject<
    THREE.AudioListener,
    NgtAudioListenerState
> {
    protected override objectInitFn(): THREE.AudioListener {
        return new THREE.AudioListener();
    }

    protected override get preObjectInit(): NgtPreObjectInit {
        return (initFn) => {
            this.set({ appendMode: 'none' });
            initFn();
        };
    }

    protected override postPrepare(audioListener: THREE.AudioListener) {
        const { filter, timeDelta } = this.get();

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
    }

    protected override destroy() {
        const camera = this.store.get((s) => s.camera);
        if (camera) {
            camera.remove(this.instance.value);
        }
        super.destroy();
    }

    protected override get optionFields(): Record<string, boolean> {
        return { ...super.optionFields, filter: true, timeDelta: true };
    }
}

@NgModule({
    declarations: [NgtAudioListener],
    exports: [NgtAudioListener],
})
export class NgtAudioListenerModule {}
