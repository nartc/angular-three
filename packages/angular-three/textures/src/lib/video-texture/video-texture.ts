// GENERATED - AngularThree v1.0.0
import * as THREE from 'three';
import { Component } from '@angular/core';
import { injectArgs, NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef, proxify } from 'angular-three';

@Component({
    selector: 'ngt-video-texture',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtVideoTexture)],
})
export class NgtVideoTexture extends THREE.VideoTexture {
    constructor() {
        super(...injectArgs<typeof THREE.VideoTexture>());
        return proxify(this);
    }
}
