// GENERATED - AngularThree v1.0.0
import * as THREE from 'three';
import { Component } from '@angular/core';
import { injectArgs, NgtInstance, provideInstanceRef, proxify } from 'angular-three';
import { NGT_INSTANCE_INPUTS, NGT_INSTANCE_OUTPUTS } from '../common';

@Component({
    selector: 'ngt-compressed-array-texture',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS, outputs: NGT_INSTANCE_OUTPUTS }],
    providers: [provideInstanceRef(NgtCompressedArrayTexture)],
})
export class NgtCompressedArrayTexture extends THREE.CompressedArrayTexture {
    constructor() {
        super(...injectArgs<typeof THREE.CompressedArrayTexture>());
        return proxify(this);
    }
}
