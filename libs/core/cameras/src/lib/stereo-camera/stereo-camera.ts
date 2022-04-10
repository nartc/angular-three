// GENERATED
import {
    AnyConstructor,
    NgtCommonCamera,
    provideCommonCameraFactory,
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
    providers: [
        provideCommonCameraFactory<THREE.StereoCamera>(NgtStereoCamera),
    ],
})
export class NgtStereoCamera extends NgtCommonCamera<THREE.StereoCamera> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.StereoCamera>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.StereoCamera>) {
        this.instanceArgs = v;
    }

    override get cameraType(): AnyConstructor<THREE.StereoCamera> {
        return THREE.StereoCamera;
    }
}

@NgModule({
    declarations: [NgtStereoCamera],
    exports: [NgtStereoCamera],
})
export class NgtStereoCameraModule {}
