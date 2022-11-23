// GENERATED - AngularThree v1.0.0
import * as THREE from 'three';
import { Component } from '@angular/core';
import { injectArgs, NgtInstance, provideInstanceRef, proxify } from '@angular-three/core';
import { NGT_INSTANCE_INPUTS } from '../common';

@Component({
    selector: 'ngt-framebuffer-texture',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS }],
    providers: [provideInstanceRef(NgtFramebufferTexture)],
})
export class NgtFramebufferTexture extends THREE.FramebufferTexture {
    constructor() {
        super(...injectArgs<typeof THREE.FramebufferTexture>());
        return proxify(this);
    }
}
