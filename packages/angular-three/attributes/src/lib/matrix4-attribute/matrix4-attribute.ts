// GENERATED - AngularThree v1.0.0
import { injectArgs, NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef, proxify } from 'angular-three';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-matrix4',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtMatrix4Attribute)],
})
export class NgtMatrix4Attribute extends THREE.Matrix4 {
    constructor() {
        super(...(injectArgs<typeof THREE.Matrix4>({ optional: true }) || []));
        return proxify(this);
    }
}
