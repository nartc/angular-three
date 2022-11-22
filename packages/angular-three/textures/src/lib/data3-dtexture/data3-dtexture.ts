// GENERATED - AngularThree v1.0.0
import * as THREE from 'three';
import { Component } from '@angular/core';
import { injectArgs, NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef, proxify } from 'angular-three';

@Component({
    selector: 'ngt-data3-dtexture',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtData3DTexture)],
})
export class NgtData3DTexture extends THREE.Data3DTexture {
    constructor() {
        super(...injectArgs<typeof THREE.Data3DTexture>());
        return proxify(this);
    }
}
