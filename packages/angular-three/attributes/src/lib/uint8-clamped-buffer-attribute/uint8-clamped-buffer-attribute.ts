// GENERATED - AngularThree v1.0.0
import { injectArgs, NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef, proxify } from 'angular-three';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-uint8-clamped-buffer-attribute',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtUint8ClampedBufferAttribute)],
})
export class NgtUint8ClampedBufferAttribute extends THREE.Uint8ClampedBufferAttribute {
    constructor() {
        super(...(injectArgs<typeof THREE.Uint8ClampedBufferAttribute>({ optional: true }) || [[], 0]));
        return proxify(this);
    }
}
