// GENERATED - AngularThree v1.0.0
import * as THREE from 'three';
import { Component } from '@angular/core';
import { injectArgs, NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef, proxify } from 'angular-three';

@Component({
    selector: 'ngt-grid-helper',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtGridHelper)],
})
export class NgtGridHelper extends THREE.GridHelper {
    constructor() {
        super(...(injectArgs<typeof THREE.GridHelper>({ optional: true }) || []));
        return proxify(this);
    }
}
