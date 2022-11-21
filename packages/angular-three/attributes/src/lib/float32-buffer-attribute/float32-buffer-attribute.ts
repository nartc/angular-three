// GENERATED - AngularThree v1.0.0
import { injectArgs, NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef, proxify } from 'angular-three';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-float32-buffer-attribute',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtFloat32BufferAttribute)],
})
export class NgtFloat32BufferAttribute extends THREE.Float32BufferAttribute {
    constructor() {
        super(...(injectArgs<typeof THREE.Float32BufferAttribute>({ optional: true }) || [[], 0]));
        return proxify(this);
    }
}
