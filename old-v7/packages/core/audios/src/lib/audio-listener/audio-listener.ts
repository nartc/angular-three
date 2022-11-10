import { NgtObject, NgtObjectInputsState, provideNgtObject, provideObjectRef } from '@angular-three/core';
import { Component } from '@angular/core';
import * as THREE from 'three';

export interface NgtAudioListenerState extends NgtObjectInputsState<THREE.AudioListener> {
  filter: AudioNode;
  timeDelta: number;
}

@Component({
  selector: 'ngt-audio-listener',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtObject(NgtAudioListener), provideObjectRef(NgtAudioListener)],
})
export class NgtAudioListener extends NgtObject<THREE.AudioListener, NgtAudioListenerState> {
  override instanceInitFn(): THREE.AudioListener {
    return new THREE.AudioListener();
  }

  override initialize() {
    super.initialize();
    this.set({ appendMode: 'none' });
  }

  override postInit() {
    super.postInit();
    const { filter, timeDelta } = this.getState();

    if (filter != null) {
      this.instanceValue.filter = filter;
    }

    if (timeDelta != null) {
      this.instanceValue.timeDelta = timeDelta;
    }

    const camera = this.store.getState((s) => s.camera);
    if (camera) {
      camera.add(this.instanceValue);
    }
  }

  override destroy() {
    const camera = this.store.getState((s) => s.camera);
    if (camera) {
      camera.remove(this.instanceValue);
    }
    super.destroy();
  }

  override get optionsFields() {
    return [...super.optionsFields, 'filter', 'timeDelta'];
  }
}
