// GENERATED - AngularThree v1.0.0
import { injectArgs, NgtInstance, provideInstanceRef, proxify } from 'angular-three';
import { Component } from '@angular/core';
import * as THREE from 'three';
import { NGT_INSTANCE_INPUTS, NGT_INSTANCE_OUTPUTS } from '../common';

@Component({
    selector: 'ngt-ring-geometry',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS, outputs: NGT_INSTANCE_OUTPUTS }],
    providers: [provideInstanceRef(NgtRingGeometry)],
})
export class NgtRingGeometry extends THREE.RingGeometry {
    constructor() {
        super(...(injectArgs<typeof THREE.RingGeometry>({ optional: true }) || []));
        return proxify(this, { attach: 'geometry' });
    }
}
