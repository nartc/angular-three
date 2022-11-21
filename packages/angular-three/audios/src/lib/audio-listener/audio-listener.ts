import * as THREE from 'three';
import { Component } from '@angular/core';
import { NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef, proxify } from 'angular-three';

@Component({
    selector: 'ngt-audio-listener',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtAudioListener)],
})
export class NgtAudioListener extends THREE.AudioListener {
    constructor() {
        super();
        return proxify(this, {
            attach: (_, listener, stateFactory) => {
                const { camera } = stateFactory();
                if (camera) {
                    camera.add(listener.value);
                }

                return () => {
                    if (camera) {
                        camera.remove(listener.value);
                    }
                };
            },
        });
    }
}
