import {
    NGT_INSTANCE_HOST_DIRECTIVE,
    NgtBeforeRenderCallback,
    NgtVector3,
    provideInstanceRef,
    proxify,
} from 'angular-three';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-mesh',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtMesh)],
    inputs: ['position', 'scale'],
})
export class NgtMesh extends THREE.Mesh {
    constructor() {
        super();
        return proxify(this);
    }

    static ngAcceptInputType_beforeRender: NgtBeforeRenderCallback<THREE.Mesh>;
    static ngAcceptInputType_position: NgtVector3 | undefined;
    static ngAcceptInputType_scale: NgtVector3 | undefined;
}
