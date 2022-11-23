// GENERATED - AngularThree v1.0.0
import * as THREE from 'three';
import { Component } from '@angular/core';
import { injectArgs, NgtInstance, provideInstanceRef, proxify } from 'angular-three';
import { NGT_INSTANCE_INPUTS } from '../common';

@Component({
    selector: 'ngt-polar-grid-helper',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS }],
    providers: [provideInstanceRef(NgtPolarGridHelper)],
})
export class NgtPolarGridHelper extends THREE.PolarGridHelper {
    constructor() {
        super(...(injectArgs<typeof THREE.PolarGridHelper>({ optional: true }) || []));
        return proxify(this);
    }
}
