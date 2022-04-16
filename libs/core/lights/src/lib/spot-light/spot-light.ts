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
    selector: 'ngt-spot-light',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonLightRef(NgtSpotLight)],
})
export class NgtSpotLight extends NgtCommonLight<THREE.SpotLight> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.SpotLight>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.SpotLight>) {
        this.instanceArgs = v;
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

    @Input() set power(power: number) {
        this.set({ power });
    }

    override get lightType(): AnyConstructor<THREE.SpotLight> {
        return THREE.SpotLight;
    }

    protected override get optionFields(): Record<string, boolean> {
        return {
            ...super.optionFields,
            distance: true,
            angle: true,
            penumbra: true,
            decay: true,
            target: true,
            power: true,
        };
    }
}

@NgModule({
    declarations: [NgtSpotLight],
    exports: [NgtSpotLight],
})
export class NgtSpotLightModule {}
