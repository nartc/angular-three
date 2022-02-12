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
    selector: 'ngt-array-camera',
    exportAs: 'ngtArrayCamera',
    providers: [
        {
            provide: NgtCommonCamera,
            useExisting: NgtArrayCamera,
        },
        NGT_OBJECT_CONTROLLER_PROVIDER,
        createParentObjectProvider(NgtArrayCamera, (parent) => parent.camera),
    ],
})
export class NgtArrayCamera extends NgtCommonCamera<THREE.ArrayCamera> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.ArrayCamera>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.ArrayCamera>) {
        this.cameraArgs = v;
    }

    cameraType = THREE.ArrayCamera;
}

@NgModule({
    declarations: [NgtArrayCamera],
    exports: [NgtArrayCamera, NgtObjectControllerModule],
})
export class NgtArrayCameraModule {}
