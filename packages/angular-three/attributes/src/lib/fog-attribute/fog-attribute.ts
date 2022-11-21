// GENERATED - AngularThree v1.0.0
import { injectArgs, NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef, proxify } from 'angular-three';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-fog-attribute',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtFogAttribute)],
})
export class NgtFogAttribute extends THREE.Fog {
    constructor() {
        super(...(injectArgs<typeof THREE.Fog>({ optional: true }) || []));
        return proxify(this);
    }
}
