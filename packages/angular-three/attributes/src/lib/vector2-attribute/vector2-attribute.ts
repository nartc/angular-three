// GENERATED - AngularThree v1.0.0
import { injectArgs, NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef, proxify } from 'angular-three';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-vector2',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtVector2Attribute)],
})
export class NgtVector2Attribute extends THREE.Vector2 {
    constructor() {
        super(...(injectArgs<typeof THREE.Vector2>({ optional: true }) || []));
        return proxify(this);
    }
}
