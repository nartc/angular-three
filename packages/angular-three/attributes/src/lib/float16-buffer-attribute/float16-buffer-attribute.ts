// GENERATED - AngularThree v1.0.0
import { injectArgs, NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef, proxify } from 'angular-three';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-float16-buffer-attribute',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtFloat16BufferAttribute)],
})
export class NgtFloat16BufferAttribute extends THREE.Float16BufferAttribute {
    constructor() {
        super(...(injectArgs<typeof THREE.Float16BufferAttribute>({ optional: true }) || [[], 0]));
        return proxify(this);
    }
}
