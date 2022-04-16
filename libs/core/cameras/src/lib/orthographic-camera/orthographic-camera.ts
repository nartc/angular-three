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
    selector: 'ngt-orthographic-camera',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonCameraRef(NgtOrthographicCamera)],
})
export class NgtOrthographicCamera extends NgtCommonCamera<THREE.OrthographicCamera> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.OrthographicCamera>
        | undefined;

    @Input() set args(
        v: ConstructorParameters<typeof THREE.OrthographicCamera>
    ) {
        this.instanceArgs = v;
    }

    @Input() set left(left: number) {
        this.set({ left });
    }

    @Input() set right(right: number) {
        this.set({ right });
    }

    @Input() set top(top: number) {
        this.set({ top });
    }

    @Input() set bottom(bottom: number) {
        this.set({ bottom });
    }

    @Input() set near(near: number) {
        this.set({ near });
    }

    @Input() set far(far: number) {
        this.set({ far });
    }

    override get cameraType(): AnyConstructor<THREE.OrthographicCamera> {
        return THREE.OrthographicCamera;
    }

    protected override get optionFields(): Record<string, boolean> {
        return {
            ...super.optionFields,
            left: true,
            right: true,
            top: true,
            bottom: true,
            near: true,
            far: true,
        };
    }
}

@NgModule({
    declarations: [NgtOrthographicCamera],
    exports: [NgtOrthographicCamera],
})
export class NgtOrthographicCameraModule {}
