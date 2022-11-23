// GENERATED - AngularThree v1.0.0
import { injectArgs, NgtInstance, provideInstanceRef, proxify } from 'angular-three';
import { Component } from '@angular/core';
import * as THREE from 'three';
import { NGT_INSTANCE_INPUTS } from '../common';

@Component({
    selector: 'ngt-dodecahedron-geometry',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS }],
    providers: [provideInstanceRef(NgtDodecahedronGeometry)],
})
export class NgtDodecahedronGeometry extends THREE.DodecahedronGeometry {
    constructor() {
        super(...(injectArgs<typeof THREE.DodecahedronGeometry>({ optional: true }) || []));
        return proxify(this, { attach: 'geometry' });
    }
}
