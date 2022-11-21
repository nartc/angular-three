// GENERATED - AngularThree v1.0.0
import { injectArgs, NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef, proxify } from 'angular-three';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-ring-geometry',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtRingGeometry)],
})
export class NgtRingGeometry extends THREE.RingGeometry {
    constructor() {
        super(...(injectArgs<typeof THREE.RingGeometry>({ optional: true }) || []));
        return proxify(this, { attach: 'geometry' });
    }
}
