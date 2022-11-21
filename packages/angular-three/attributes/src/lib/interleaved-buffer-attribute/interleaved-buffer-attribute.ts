// GENERATED - AngularThree v1.0.0
import { injectArgs, NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef, proxify } from 'angular-three';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-interleaved-buffer-attribute',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtInterleavedBufferAttribute)],
})
export class NgtInterleavedBufferAttribute extends THREE.InterleavedBufferAttribute {
    constructor() {
        super(...(injectArgs<typeof THREE.InterleavedBufferAttribute>({ optional: true }) || [new THREE.InterleavedBuffer([], 0), 0, 0]));
        return proxify(this);
    }
}
