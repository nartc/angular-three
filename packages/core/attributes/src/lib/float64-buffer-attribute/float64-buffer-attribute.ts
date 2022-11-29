// GENERATED - AngularThree v1.0.0
import { injectArgs, NgtInstance, provideInstanceRef, proxify } from '@angular-three/core';
import { Component } from '@angular/core';
import * as THREE from 'three';
import { NGT_INSTANCE_INPUTS } from '../common';

@Component({
    selector: 'ngt-float64-buffer-attribute',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS }],
    providers: [provideInstanceRef(NgtFloat64BufferAttribute)],
})
export class NgtFloat64BufferAttribute extends THREE.Float64BufferAttribute {
    constructor() {
        super(...(injectArgs<typeof THREE.Float64BufferAttribute>({ optional: true })?.() || [[], 0]));
        return proxify(this);
    }
}
