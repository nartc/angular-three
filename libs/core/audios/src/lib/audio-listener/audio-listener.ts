import {
  NgtObject,
  NgtObjectInputsState,
  provideNgtObject,
  provideObjectRef,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import * as THREE from 'three';

export interface NgtAudioListenerState
  extends NgtObjectInputsState<THREE.AudioListener> {
  filter: AudioNode;
  timeDelta: number;
}

@Component({
  selector: 'ngt-audio-listener',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideNgtObject(NgtAudioListener),
    provideObjectRef(NgtAudioListener),
  ],
})
export class NgtAudioListener extends NgtObject<
  THREE.AudioListener,
  NgtAudioListenerState
> {
  override instanceInitFn(): THREE.AudioListener {
    return new THREE.AudioListener();
  }

  override preInit() {
    super.preInit();
    this.set({ appendMode: 'none' });
  }

  override postPrepare(listener: THREE.AudioListener) {
    const { filter, timeDelta } = this.get();

    if (filter != null) {
      listener.filter = filter;
    }

    if (timeDelta != null) {
      listener.timeDelta = timeDelta;
    }

    const camera = this.store.get((s) => s.camera);
    if (camera) {
      camera.add(listener);
    }
  }

  protected override destroy() {
    const camera = this.store.get((s) => s.camera);
    if (camera) {
      camera.remove(this.instanceValue);
    }
    super.destroy();
  }

  protected override get optionsFields(): Record<string, boolean> {
    return { ...super.optionsFields, filter: true, timeDelta: true };
  }
}
