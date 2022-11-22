// GENERATED - AngularThree v1.0.0
import {
    injectArgs,
    NGT_INSTANCE_INPUTS,
    NGT_INSTANCE_OUTPUTS,
    NgtInstance,
    provideInstanceRef,
    proxify,
} from 'angular-three';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-extrude-geometry',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS, outputs: NGT_INSTANCE_OUTPUTS }],
    providers: [provideInstanceRef(NgtExtrudeGeometry)],
})
export class NgtExtrudeGeometry extends THREE.ExtrudeGeometry {
    constructor() {
        super(...(injectArgs<typeof THREE.ExtrudeGeometry>({ optional: true }) || []));
        return proxify(this, { attach: 'geometry' });
    }
}
