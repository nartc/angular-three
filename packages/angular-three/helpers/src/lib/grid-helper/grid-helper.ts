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
    selector: 'ngt-grid-helper',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS, outputs: NGT_INSTANCE_OUTPUTS }],
    providers: [provideInstanceRef(NgtGridHelper)],
})
export class NgtGridHelper extends THREE.GridHelper {
    constructor() {
        super(...(injectArgs<typeof THREE.GridHelper>({ optional: true }) || []));
        return proxify(this);
    }
}
