// GENERATED - AngularThree v1.0.0
import { injectArgs, NgtInstance, provideInstanceRef, proxify } from '@angular-three/core';
import { Component } from '@angular/core';
import * as THREE from 'three';
import { NGT_INSTANCE_INPUTS } from '../common';

@Component({
    selector: 'ngt-vector3',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS }],
    providers: [provideInstanceRef(NgtVector3Attribute)],
})
export class NgtVector3Attribute extends THREE.Vector3 {
    constructor() {
        super(...(injectArgs<typeof THREE.Vector3>({ optional: true }) || []));
        return proxify(this);
    }
}
