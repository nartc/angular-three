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
    selector: 'ngt-ambient-light-probe',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonLightFactory<THREE.AmbientLightProbe>(
            NgtAmbientLightProbe
        ),
    ],
})
export class NgtAmbientLightProbe extends NgtCommonLight<THREE.AmbientLightProbe> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.AmbientLightProbe>
        | undefined;

    @Input() set args(
        v: ConstructorParameters<typeof THREE.AmbientLightProbe>
    ) {
        this.instanceArgs = v;
    }

    override get lightType(): AnyConstructor<THREE.AmbientLightProbe> {
        return THREE.AmbientLightProbe;
    }
}

@NgModule({
    declarations: [NgtAmbientLightProbe],
    exports: [NgtAmbientLightProbe],
})
export class NgtAmbientLightProbeModule {}
