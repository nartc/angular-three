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
    selector: 'ngt-light-probe',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonLightFactory<THREE.LightProbe>(NgtLightProbe)],
})
export class NgtLightProbe extends NgtCommonLight<THREE.LightProbe> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.LightProbe>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.LightProbe>) {
        this.instanceArgs = v;
    }

    @Input() set sh(sh: THREE.SphericalHarmonics3) {
        this.set({ sh });
    }

    override get lightType(): AnyConstructor<THREE.LightProbe> {
        return THREE.LightProbe;
    }

    protected override get optionFields(): Record<string, boolean> {
        return {
            ...super.optionFields,
            sh: true,
        };
    }
}

@NgModule({
    declarations: [NgtLightProbe],
    exports: [NgtLightProbe],
})
export class NgtLightProbeModule {}
