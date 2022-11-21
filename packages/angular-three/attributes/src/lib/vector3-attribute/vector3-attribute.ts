// GENERATED - AngularThree v1.0.0
import { injectArgs, NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef, proxify } from 'angular-three';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-vector3-attribute',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtVector3Attribute)],
})
export class NgtVector3Attribute extends THREE.Vector3 {
    constructor() {
        super(...(injectArgs<typeof THREE.Vector3>({ optional: true }) || []));
        return proxify(this);
    }
}
