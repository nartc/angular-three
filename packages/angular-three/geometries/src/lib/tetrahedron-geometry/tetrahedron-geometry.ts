// GENERATED - AngularThree v1.0.0
import { injectArgs, NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef, proxify } from 'angular-three';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-tetrahedron-geometry',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtTetrahedronGeometry)],
})
export class NgtTetrahedronGeometry extends THREE.TetrahedronGeometry {
    constructor() {
        super(...(injectArgs<typeof THREE.TetrahedronGeometry>({ optional: true }) || []));
        return proxify(this, { attach: 'geometry' });
    }
}
