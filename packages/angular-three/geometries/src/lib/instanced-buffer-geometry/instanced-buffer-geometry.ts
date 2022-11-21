// GENERATED - AngularThree v1.0.0
import { injectArgs, NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef, proxify } from 'angular-three';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-instanced-buffer-geometry',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtInstancedBufferGeometry)],
})
export class NgtInstancedBufferGeometry extends THREE.InstancedBufferGeometry {
    constructor() {
        super(...(injectArgs<typeof THREE.InstancedBufferGeometry>({ optional: true }) || []));
        return proxify(this, { attach: 'geometry' });
    }
}
