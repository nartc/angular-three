// GENERATED - AngularThree v1.0.0
import { injectArgs, NgtInstance, provideInstanceRef, proxify } from '@angular-three/core';
import { Component } from '@angular/core';
import * as THREE from 'three';
import { NGT_INSTANCE_INPUTS } from '../common';

@Component({
    selector: 'ngt-int16-buffer-attribute',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS }],
    providers: [provideInstanceRef(NgtInt16BufferAttribute)],
})
export class NgtInt16BufferAttribute extends THREE.Int16BufferAttribute {
    constructor() {
        super(...(injectArgs<typeof THREE.Int16BufferAttribute>({ optional: true }) || [[], 0]));
        return proxify(this);
    }
}
