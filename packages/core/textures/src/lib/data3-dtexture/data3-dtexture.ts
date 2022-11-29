// GENERATED - AngularThree v1.0.0
import { injectArgs, NgtInstance, provideInstanceRef, proxify } from '@angular-three/core';
import { Component } from '@angular/core';
import * as THREE from 'three';
import { NGT_INSTANCE_INPUTS } from '../common';

@Component({
    selector: 'ngt-data3-dtexture',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS }],
    providers: [provideInstanceRef(NgtData3DTexture)],
})
export class NgtData3DTexture extends THREE.Data3DTexture {
    constructor() {
        super(...injectArgs<typeof THREE.Data3DTexture>()());
        return proxify(this);
    }
}
