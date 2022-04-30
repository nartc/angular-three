// GENERATED
import {
    AnyConstructor,
    NgtCommonCamera,
    provideCommonCameraRef,
} from '@angular-three/core';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    NgModule,
} from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-stereo-camera',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonCameraRef(NgtStereoCamera)],
})
export class NgtStereoCamera extends NgtCommonCamera<THREE.StereoCamera> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.StereoCamera>
        | undefined;

    override get cameraType(): AnyConstructor<THREE.StereoCamera> {
        return THREE.StereoCamera;
    }
}

@NgModule({
    declarations: [NgtStereoCamera],
    exports: [NgtStereoCamera],
})
export class NgtStereoCameraModule {}
