// GENERATED
import {
    AnyConstructor,
    NgtCommonLight,
    provideCommonLightFactory,
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
    providers: [
        provideCommonLightFactory<THREE.DirectionalLight>(NgtDirectionalLight),
    ],
})
export class NgtDirectionalLight extends NgtCommonLight<THREE.DirectionalLight> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.DirectionalLight>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.DirectionalLight>) {
        this.lightArgs = v;
    }

    @Input() set target(target: THREE.Object3D) {
        this.set({ target });
    }

    @Input() set shadow(shadow: THREE.DirectionalLightShadow) {
        this.set({ shadow });
    }

    override get lightType(): AnyConstructor<THREE.DirectionalLight> {
        return THREE.DirectionalLight;
    }

    protected override get subInputs(): Record<string, boolean> {
        return {
            ...super.subInputs,
            target: true,
            shadow: true,
        };
    }
}

@NgModule({
    declarations: [NgtDirectionalLight],
    exports: [NgtDirectionalLight],
})
export class NgtDirectionalLightModule {}
