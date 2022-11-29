// GENERATED - AngularThree v1.0.0
import { injectArgs, NgtInstance, provideInstanceRef, proxify } from '@angular-three/core';
import { Component } from '@angular/core';
import * as THREE from 'three';
import { NGT_INSTANCE_INPUTS } from '../common';

@Component({
    selector: 'ngt-uint8-buffer-attribute',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS }],
    providers: [provideInstanceRef(NgtUint8BufferAttribute)],
})
export class NgtUint8BufferAttribute extends THREE.Uint8BufferAttribute {
    constructor() {
        super(...(injectArgs<typeof THREE.Uint8BufferAttribute>({ optional: true })?.() || [[], 0]));
        return proxify(this);
    }
}
