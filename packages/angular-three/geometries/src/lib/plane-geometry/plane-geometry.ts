// GENERATED - AngularThree v1.0.0
import { injectArgs, NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef, proxify } from 'angular-three';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-plane-geometry',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtPlaneGeometry)],
})
export class NgtPlaneGeometry extends THREE.PlaneGeometry {
    constructor() {
        super(...(injectArgs<typeof THREE.PlaneGeometry>({ optional: true }) || []));
        return proxify(this, { attach: 'geometry' });
    }
}
