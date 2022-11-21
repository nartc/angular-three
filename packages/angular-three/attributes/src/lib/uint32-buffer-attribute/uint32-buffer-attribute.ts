// GENERATED - AngularThree v1.0.0
import { injectArgs, NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef, proxify } from 'angular-three';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-uint32-buffer-attribute',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtUint32BufferAttribute)],
})
export class NgtUint32BufferAttribute extends THREE.Uint32BufferAttribute {
    constructor() {
        super(...(injectArgs<typeof THREE.Uint32BufferAttribute>({ optional: true }) || [[], 0]));
        return proxify(this);
    }
}
