// GENERATED - AngularThree v1.0.0
import { injectArgs, NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef, proxify } from 'angular-three';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-vector4',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtVector4Attribute)],
})
export class NgtVector4Attribute extends THREE.Vector4 {
    constructor() {
        super(...(injectArgs<typeof THREE.Vector4>({ optional: true }) || []));
        return proxify(this);
    }
}
