// GENERATED - AngularThree v1.0.0
import * as THREE from 'three';
import { Component } from '@angular/core';
import { injectArgs, NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef, proxify } from 'angular-three';

@Component({
    selector: 'ngt-arrow-helper',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtArrowHelper)],
})
export class NgtArrowHelper extends THREE.ArrowHelper {
    constructor() {
        super(...(injectArgs<typeof THREE.ArrowHelper>({ optional: true }) || []));
        return proxify(this);
    }
}
