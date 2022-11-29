// GENERATED - AngularThree v1.0.0
import { injectArgs, NgtInstance, provideInstanceRef, proxify } from '@angular-three/core';
import { Component } from '@angular/core';
import * as THREE from 'three';
import { NGT_INSTANCE_INPUTS } from '../common';

@Component({
    selector: 'ngt-capsule-geometry',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS }],
    providers: [provideInstanceRef(NgtCapsuleGeometry)],
})
export class NgtCapsuleGeometry extends THREE.CapsuleGeometry {
    constructor() {
        super(...(injectArgs<typeof THREE.CapsuleGeometry>({ optional: true })?.() || []));
        return proxify(this, { attach: 'geometry' });
    }
}
