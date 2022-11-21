import { injectArgs, NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef, proxify } from 'angular-three';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-instanced-mesh',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtInstancedMesh)],
})
export class NgtInstancedMesh extends THREE.InstancedMesh {
    constructor() {
        super(...(injectArgs<typeof THREE.InstancedMesh>({ optional: true }) || [, , 0]));
        return proxify(this, {
            created: (instance) => instance.instanceMatrix.setUsage(THREE.DynamicDrawUsage),
        });
    }
}
