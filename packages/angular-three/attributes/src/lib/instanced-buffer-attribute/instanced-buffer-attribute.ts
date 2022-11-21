import { injectArgs, NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef, proxify } from 'angular-three';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-instanced-buffer-attribute',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtInstancedBufferAttribute)],
})
export class NgtInstancedBufferAttribute extends THREE.InstancedBufferAttribute {
    constructor() {
        super(...(injectArgs<typeof THREE.InstancedBufferAttribute>({ optional: true }) || [[], 0]));
        return proxify(this);
    }
}
