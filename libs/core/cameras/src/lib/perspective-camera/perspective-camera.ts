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
    selector: 'ngt-perspective-camera',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonCameraFactory<THREE.PerspectiveCamera>(
            NgtPerspectiveCamera
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
        this.instanceArgs = v;
    }

    @Input() set fov(fov: number) {
        this.set({ fov });
    }

    @Input() set aspect(aspect: number) {
        this.set({ aspect });
    }

    @Input() set near(near: number) {
        this.set({ near });
    }

    @Input() set far(far: number) {
        this.set({ far });
    }

    override get cameraType(): AnyConstructor<THREE.PerspectiveCamera> {
        return THREE.PerspectiveCamera;
    }

    protected override get optionFields(): Record<string, boolean> {
        return {
            ...super.optionFields,
            fov: true,
            aspect: true,
            near: true,
            far: true,
        };
    }
}

@NgModule({
    declarations: [NgtPerspectiveCamera],
    exports: [NgtPerspectiveCamera],
})
export class NgtPerspectiveCameraModule {}
