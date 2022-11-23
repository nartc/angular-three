// GENERATED - AngularThree v1.0.0
import { injectArgs, NgtInstance, provideInstanceRef, proxify } from '@angular-three/core';
import { Component } from '@angular/core';
import * as THREE from 'three';
import { NGT_INSTANCE_INPUTS } from '../common';

@Component({
    selector: 'ngt-edges-geometry',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS }],
    providers: [provideInstanceRef(NgtEdgesGeometry)],
})
export class NgtEdgesGeometry extends THREE.EdgesGeometry {
    constructor() {
        super(...(injectArgs<typeof THREE.EdgesGeometry>({ optional: true }) || []));
        return proxify(this, { attach: 'geometry' });
    }
}
