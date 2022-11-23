// GENERATED - AngularThree v1.0.0
import { injectArgs, NgtInstance, provideInstanceRef, proxify } from 'angular-three';
import { Component } from '@angular/core';
import * as THREE from 'three';
import { NGT_INSTANCE_INPUTS, NGT_INSTANCE_OUTPUTS } from '../common';

@Component({
    selector: 'ngt-float16-buffer-attribute',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS, outputs: NGT_INSTANCE_OUTPUTS }],
    providers: [provideInstanceRef(NgtFloat16BufferAttribute)],
})
export class NgtFloat16BufferAttribute extends THREE.Float16BufferAttribute {
    constructor() {
        super(...(injectArgs<typeof THREE.Float16BufferAttribute>({ optional: true }) || [[], 0]));
        return proxify(this);
    }
}
