// GENERATED - AngularThree v1.0.0
import { injectArgs, NgtInstance, provideInstanceRef, proxify } from '@angular-three/core';
import { Component } from '@angular/core';
import * as THREE from 'three';
import { NGT_INSTANCE_INPUTS } from '../common';

@Component({
    selector: 'ngt-interleaved-buffer-attribute',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS }],
    providers: [provideInstanceRef(NgtInterleavedBufferAttribute)],
})
export class NgtInterleavedBufferAttribute extends THREE.InterleavedBufferAttribute {
    constructor() {
        super(
            ...(injectArgs<typeof THREE.InterleavedBufferAttribute>({ optional: true }) || [
                new THREE.InterleavedBuffer([], 0),
                0,
                0,
            ])
        );
        return proxify(this);
    }
}
