// GENERATED - AngularThree v1.0.0
import { injectArgs, NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef, proxify } from 'angular-three';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-polyhedron-geometry',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtPolyhedronGeometry)],
})
export class NgtPolyhedronGeometry extends THREE.PolyhedronGeometry {
    constructor() {
        super(...(injectArgs<typeof THREE.PolyhedronGeometry>({ optional: true }) || []));
        return proxify(this, { attach: 'geometry' });
    }
}
