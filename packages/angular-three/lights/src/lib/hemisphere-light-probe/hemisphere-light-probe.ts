// GENERATED - AngularThree v1.0.0
import * as THREE from 'three';
import { Component } from '@angular/core';
import { injectArgs, NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef, proxify } from 'angular-three';

@Component({
    selector: 'ngt-hemisphere-light-probe',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtHemisphereLightProbe)],
})
export class NgtHemisphereLightProbe extends THREE.HemisphereLightProbe {
    constructor() {
        super(...(injectArgs<typeof THREE.HemisphereLightProbe>({ optional: true }) || []));
        return proxify(this);
    }
}
