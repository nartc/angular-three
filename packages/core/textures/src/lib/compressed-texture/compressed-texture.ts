// GENERATED - AngularThree v1.0.0
import { injectArgs, NgtInstance, provideInstanceRef, proxify } from '@angular-three/core';
import { Component } from '@angular/core';
import * as THREE from 'three';
import { NGT_INSTANCE_INPUTS } from '../common';

@Component({
    selector: 'ngt-compressed-texture',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS }],
    providers: [provideInstanceRef(NgtCompressedTexture)],
})
export class NgtCompressedTexture extends THREE.CompressedTexture {
    constructor() {
        super(...injectArgs<typeof THREE.CompressedTexture>());
        return proxify(this);
    }
}
