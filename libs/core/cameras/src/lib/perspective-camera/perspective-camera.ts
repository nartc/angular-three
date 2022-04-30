// GENERATED
import {
    AnyConstructor,
    NgtCommonCamera,
    provideCommonCameraRef,
    coerceNumberProperty,
    NumberInput,
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
    providers: [provideCommonCameraRef(NgtPerspectiveCamera)],
})
export class NgtPerspectiveCamera extends NgtCommonCamera<THREE.PerspectiveCamera> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.PerspectiveCamera>
        | undefined;

    @Input() set fov(fov: NumberInput) {
        this.set({ fov: coerceNumberProperty(fov) });
    }

    @Input() set aspect(aspect: NumberInput) {
        this.set({ aspect: coerceNumberProperty(aspect) });
    }

    @Input() set near(near: NumberInput) {
        this.set({ near: coerceNumberProperty(near) });
    }

    @Input() set far(far: NumberInput) {
        this.set({ far: coerceNumberProperty(far) });
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
