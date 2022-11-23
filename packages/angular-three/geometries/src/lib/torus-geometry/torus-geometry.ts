// GENERATED - AngularThree v1.0.0
import { injectArgs, NgtInstance, provideInstanceRef, proxify } from 'angular-three';
import { Component } from '@angular/core';
import * as THREE from 'three';
import { NGT_INSTANCE_INPUTS } from '../common';

@Component({
    selector: 'ngt-torus-geometry',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS }],
    providers: [provideInstanceRef(NgtTorusGeometry)],
})
export class NgtTorusGeometry extends THREE.TorusGeometry {
    constructor() {
        super(...(injectArgs<typeof THREE.TorusGeometry>({ optional: true }) || []));
        return proxify(this, { attach: 'geometry' });
    }
}
