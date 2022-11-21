// GENERATED - AngularThree v1.0.0
import { injectArgs, NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef, proxify } from 'angular-three';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-matrix3',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtMatrix3Attribute)],
})
export class NgtMatrix3Attribute extends THREE.Matrix3 {
    constructor() {
        super(...(injectArgs<typeof THREE.Matrix3>({ optional: true }) || []));
        return proxify(this);
    }
}
