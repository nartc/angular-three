// GENERATED - AngularThree v1.0.0
import { injectArgs, NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef, proxify } from 'angular-three';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-circle-geometry',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtCircleGeometry)],
})
export class NgtCircleGeometry extends THREE.CircleGeometry {
    constructor() {
        super(...(injectArgs<typeof THREE.CircleGeometry>({ optional: true }) || []));
        return proxify(this, { attach: 'geometry' });
    }
}
