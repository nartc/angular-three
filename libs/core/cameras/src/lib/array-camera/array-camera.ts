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
    selector: 'ngt-array-camera',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonCameraFactory<THREE.ArrayCamera>(NgtArrayCamera)],
})
export class NgtArrayCamera extends NgtCommonCamera<THREE.ArrayCamera> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.ArrayCamera>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.ArrayCamera>) {
        this.cameraArgs = v;
    }

    @Input() set cameras(cameras: THREE.PerspectiveCamera[]) {
        this.set({ cameras });
    }

    override get cameraType(): AnyConstructor<THREE.ArrayCamera> {
        return THREE.ArrayCamera;
    }

    protected override get subInputs(): Record<string, boolean> {
        return {
            ...super.subInputs,
            cameras: true,
        };
    }
}

@NgModule({
    declarations: [NgtArrayCamera],
    exports: [NgtArrayCamera],
})
export class NgtArrayCameraModule {}