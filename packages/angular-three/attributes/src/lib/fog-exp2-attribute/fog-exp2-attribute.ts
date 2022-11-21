// GENERATED - AngularThree v1.0.0
import { injectArgs, NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef, proxify } from 'angular-three';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-fog-exp2',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtFogExp2Attribute)],
})
export class NgtFogExp2Attribute extends THREE.FogExp2 {
    constructor() {
        super(...(injectArgs<typeof THREE.FogExp2>({ optional: true }) || ["#fff"]));
        return proxify(this);
    }
}
