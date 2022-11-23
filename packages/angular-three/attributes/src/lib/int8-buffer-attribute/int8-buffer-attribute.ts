// GENERATED - AngularThree v1.0.0
import { injectArgs, NgtInstance, provideInstanceRef, proxify } from 'angular-three';
import { Component } from '@angular/core';
import * as THREE from 'three';
import { NGT_INSTANCE_INPUTS, NGT_INSTANCE_OUTPUTS } from '../common';

@Component({
    selector: 'ngt-int8-buffer-attribute',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS, outputs: NGT_INSTANCE_OUTPUTS }],
    providers: [provideInstanceRef(NgtInt8BufferAttribute)],
})
export class NgtInt8BufferAttribute extends THREE.Int8BufferAttribute {
    constructor() {
        super(...(injectArgs<typeof THREE.Int8BufferAttribute>({ optional: true }) || [[], 0]));
        return proxify(this);
    }
}
