// GENERATED - AngularThree v1.0.0
import * as THREE from 'three';
import { Component } from '@angular/core';
import {
    injectArgs,
    NGT_INSTANCE_INPUTS,
    NGT_INSTANCE_OUTPUTS,
    NgtInstance,
    provideInstanceRef,
    proxify,
} from 'angular-three';

@Component({
    selector: 'ngt-polar-grid-helper',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS, outputs: NGT_INSTANCE_OUTPUTS }],
    providers: [provideInstanceRef(NgtPolarGridHelper)],
})
export class NgtPolarGridHelper extends THREE.PolarGridHelper {
    constructor() {
        super(...(injectArgs<typeof THREE.PolarGridHelper>({ optional: true }) || []));
        return proxify(this);
    }
}
