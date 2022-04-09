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
    selector: 'ngt-spot-light',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonLightFactory<THREE.SpotLight>(NgtSpotLight)],
})
export class NgtSpotLight extends NgtCommonLight<THREE.SpotLight> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.SpotLight>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.SpotLight>) {
        this.lightArgs = v;
    }

    @Input() set distance(distance: number) {
        this.set({ distance });
    }

    @Input() set angle(angle: number) {
        this.set({ angle });
    }

    @Input() set penumbra(penumbra: number) {
        this.set({ penumbra });
    }

    @Input() set decay(decay: number) {
        this.set({ decay });
    }

    @Input() set target(target: THREE.Object3D) {
        this.set({ target });
    }

    @Input() set shadow(shadow: THREE.SpotLightShadow) {
        this.set({ shadow });
    }

    @Input() set power(power: number) {
        this.set({ power });
    }

    override get lightType(): AnyConstructor<THREE.SpotLight> {
        return THREE.SpotLight;
    }

    protected override get subInputs(): Record<string, boolean> {
        return {
            ...super.subInputs,
            distance: true,
            angle: true,
            penumbra: true,
            decay: true,
            target: true,
            shadow: true,
            power: true,
        };
    }
}

@NgModule({
    declarations: [NgtSpotLight],
    exports: [NgtSpotLight],
})
export class NgtSpotLightModule {}
