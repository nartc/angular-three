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
    selector: 'ngt-array-camera',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonCameraRef(NgtArrayCamera)],
})
export class NgtArrayCamera extends NgtCommonCamera<THREE.ArrayCamera> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.ArrayCamera>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.ArrayCamera>) {
        this.instanceArgs = v;
    }

    @Input() set cameras(cameras: THREE.PerspectiveCamera[]) {
        this.set({ cameras });
    }

    override get cameraType(): AnyConstructor<THREE.ArrayCamera> {
        return THREE.ArrayCamera;
    }

    protected override get optionFields(): Record<string, boolean> {
        return {
            ...super.optionFields,
            cameras: true,
        };
    }
}

@NgModule({
    declarations: [NgtArrayCamera],
    exports: [NgtArrayCamera],
})
export class NgtArrayCameraModule {}
