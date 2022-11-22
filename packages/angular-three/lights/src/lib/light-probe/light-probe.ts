// GENERATED - AngularThree v1.0.0
import * as THREE from 'three';
import { Component } from '@angular/core';
import { injectArgs, NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef, proxify } from 'angular-three';

@Component({
    selector: 'ngt-light-probe',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtLightProbe)],
})
export class NgtLightProbe extends THREE.LightProbe {
    constructor() {
        super(...(injectArgs<typeof THREE.LightProbe>({ optional: true }) || []));
        return proxify(this);
    }
}
