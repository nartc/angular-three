// GENERATED - AngularThree v1.0.0
import { injectArgs, NgtInstance, provideInstanceRef, proxify } from '@angular-three/core';
import { Component } from '@angular/core';
import * as THREE from 'three';
import { NGT_INSTANCE_INPUTS } from '../common';

@Component({
    selector: 'ngt-matrix3',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS }],
    providers: [provideInstanceRef(NgtMatrix3Attribute)],
})
export class NgtMatrix3Attribute extends THREE.Matrix3 {
    constructor() {
        super(...(injectArgs<typeof THREE.Matrix3>({ optional: true })?.() || []));
        return proxify(this);
    }
}
