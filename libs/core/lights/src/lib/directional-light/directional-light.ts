// GENERATED
import {
    AnyConstructor,
    NgtCommonLight,
    provideCommonLightRef,
} from '@angular-three/core';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    NgModule,
} from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-directional-light',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonLightRef(NgtDirectionalLight)],
})
export class NgtDirectionalLight extends NgtCommonLight<THREE.DirectionalLight> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.DirectionalLight>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.DirectionalLight>) {
        this.instanceArgs = v;
    }

    @Input() set target(target: THREE.Object3D) {
        this.set({ target });
    }

    override get lightType(): AnyConstructor<THREE.DirectionalLight> {
        return THREE.DirectionalLight;
    }

    protected override get optionFields(): Record<string, boolean> {
        return {
            ...super.optionFields,
            target: true,
        };
    }
}

@NgModule({
    declarations: [NgtDirectionalLight],
    exports: [NgtDirectionalLight],
})
export class NgtDirectionalLightModule {}
