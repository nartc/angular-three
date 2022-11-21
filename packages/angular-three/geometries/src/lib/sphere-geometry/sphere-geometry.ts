// GENERATED - AngularThree v1.0.0
import { injectArgs, NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef, proxify } from 'angular-three';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-sphere-geometry',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtSphereGeometry)],
})
export class NgtSphereGeometry extends THREE.SphereGeometry {
    constructor() {
        super(...(injectArgs<typeof THREE.SphereGeometry>({ optional: true }) || []));
        return proxify(this, { attach: 'geometry' });
    }
}
