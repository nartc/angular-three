// GENERATED - AngularThree v1.0.0
import * as THREE from 'three';
import { Component } from '@angular/core';
import { injectArgs, NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef, proxify } from 'angular-three';

@Component({
    selector: 'ngt-spot-light',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtSpotLight)],
})
export class NgtSpotLight extends THREE.SpotLight {
    constructor() {
        super(...(injectArgs<typeof THREE.SpotLight>({ optional: true }) || []));
        return proxify(this);
    }
}
