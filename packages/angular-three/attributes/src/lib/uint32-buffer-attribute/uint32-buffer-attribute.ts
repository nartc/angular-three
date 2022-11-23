// GENERATED - AngularThree v1.0.0
import { injectArgs, NgtInstance, provideInstanceRef, proxify } from 'angular-three';
import { Component } from '@angular/core';
import * as THREE from 'three';
import { NGT_INSTANCE_INPUTS } from '../common';

@Component({
    selector: 'ngt-uint32-buffer-attribute',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS }],
    providers: [provideInstanceRef(NgtUint32BufferAttribute)],
})
export class NgtUint32BufferAttribute extends THREE.Uint32BufferAttribute {
    constructor() {
        super(...(injectArgs<typeof THREE.Uint32BufferAttribute>({ optional: true }) || [[], 0]));
        return proxify(this);
    }
}
