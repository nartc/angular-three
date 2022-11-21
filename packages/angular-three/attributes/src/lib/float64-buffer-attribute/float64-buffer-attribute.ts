// GENERATED - AngularThree v1.0.0
import { injectArgs, NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef, proxify } from 'angular-three';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-float64-buffer-attribute',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtFloat64BufferAttribute)],
})
export class NgtFloat64BufferAttribute extends THREE.Float64BufferAttribute {
    constructor() {
        super(...(injectArgs<typeof THREE.Float64BufferAttribute>({ optional: true }) || [[], 0]));
        return proxify(this);
    }
}
