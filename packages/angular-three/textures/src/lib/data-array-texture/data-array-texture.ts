// GENERATED - AngularThree v1.0.0
import * as THREE from 'three';
import { Component } from '@angular/core';
import { injectArgs, NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef, proxify } from 'angular-three';

@Component({
    selector: 'ngt-data-array-texture',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtDataArrayTexture)],
})
export class NgtDataArrayTexture extends THREE.DataArrayTexture {
    constructor() {
        super(...injectArgs<typeof THREE.DataArrayTexture>());
        return proxify(this);
    }
}
