// GENERATED - AngularThree v1.0.0
import { injectArgs, NgtInstance, provideInstanceRef, proxify } from '@angular-three/core';
import { Component } from '@angular/core';
import * as THREE from 'three';
import { NGT_INSTANCE_INPUTS } from '../common';

@Component({
    selector: 'ngt-fog-exp2',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS }],
    providers: [provideInstanceRef(NgtFogExp2Attribute)],
})
export class NgtFogExp2Attribute extends THREE.FogExp2 {
    constructor() {
        super(...(injectArgs<typeof THREE.FogExp2>({ optional: true })?.() || ['#fff']));
        return proxify(this);
    }
}
