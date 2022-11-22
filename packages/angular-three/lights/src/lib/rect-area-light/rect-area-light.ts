// GENERATED - AngularThree v1.0.0
import * as THREE from 'three';
import { Component } from '@angular/core';
import { injectArgs, NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef, proxify } from 'angular-three';

@Component({
    selector: 'ngt-rect-area-light',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtRectAreaLight)],
})
export class NgtRectAreaLight extends THREE.RectAreaLight {
    constructor() {
        super(...(injectArgs<typeof THREE.RectAreaLight>({ optional: true }) || []));
        return proxify(this);
    }
}
