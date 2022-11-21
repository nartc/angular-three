import { injectArgs, NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef, proxify } from 'angular-three';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-color',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtColorAttribute)],
})
export class NgtColorAttribute extends THREE.Color {
    constructor() {
        super(...(injectArgs<typeof THREE.Color>({ optional: true }) || []));
        return proxify(this);
    }
}
