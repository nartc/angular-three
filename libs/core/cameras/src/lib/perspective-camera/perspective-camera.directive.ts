// GENERATED
import {
    createParentObjectProvider,
    NgtCommonCamera,
    NGT_OBJECT_CONTROLLER_PROVIDER,
    NgtObjectControllerModule,
} from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
    selector: 'ngt-perspective-camera',
    exportAs: 'ngtPerspectiveCamera',
    providers: [
        {
            provide: NgtCommonCamera,
            useExisting: NgtPerspectiveCamera,
        },
        NGT_OBJECT_CONTROLLER_PROVIDER,
        createParentObjectProvider(
            NgtPerspectiveCamera,
            (parent) => parent.camera
        ),
    ],
})
export class NgtPerspectiveCamera extends NgtCommonCamera<THREE.PerspectiveCamera> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.PerspectiveCamera>
        | undefined;

    @Input() set args(
        v: ConstructorParameters<typeof THREE.PerspectiveCamera>
    ) {
        this.cameraArgs = v;
    }

    cameraType = THREE.PerspectiveCamera;
}

@NgModule({
    declarations: [NgtPerspectiveCamera],
    exports: [NgtPerspectiveCamera, NgtObjectControllerModule],
})
export class NgtPerspectiveCameraModule {}
