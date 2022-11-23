// GENERATED - AngularThree v1.0.0
import { injectArgs, NgtInstance, provideInstanceRef, proxify } from 'angular-three';
import { Component } from '@angular/core';
import * as THREE from 'three';
import { NGT_INSTANCE_INPUTS } from '../common';

@Component({
    selector: 'ngt-uint16-buffer-attribute',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS }],
    providers: [provideInstanceRef(NgtUint16BufferAttribute)],
})
export class NgtUint16BufferAttribute extends THREE.Uint16BufferAttribute {
    constructor() {
        super(...(injectArgs<typeof THREE.Uint16BufferAttribute>({ optional: true }) || [[], 0]));
        return proxify(this);
    }
}
