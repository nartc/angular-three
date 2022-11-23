// GENERATED - AngularThree v1.0.0
import * as THREE from 'three';
import { Component } from '@angular/core';
import { injectArgs, NgtInstance, provideInstanceRef, proxify } from '@angular-three/core';
import { NGT_INSTANCE_INPUTS } from '../common';

@Component({
    selector: 'ngt-data-array-texture',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS }],
    providers: [provideInstanceRef(NgtDataArrayTexture)],
})
export class NgtDataArrayTexture extends THREE.DataArrayTexture {
    constructor() {
        super(...injectArgs<typeof THREE.DataArrayTexture>());
        return proxify(this);
    }
}
