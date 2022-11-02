// GENERATED
import {
    AnyConstructor,
    NgtCommonLight,
    provideNgtCommonLight,
    provideCommonLightRef,
} from '@angular-three/core';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
} from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-ambient-light-probe',
    standalone: true,
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideNgtCommonLight(NgtAmbientLightProbe),
        provideCommonLightRef(NgtAmbientLightProbe)
    ],
})
export class NgtAmbientLightProbe extends NgtCommonLight<THREE.AmbientLightProbe> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.AmbientLightProbe>
        | undefined;

    

    override get lightType(): AnyConstructor<THREE.AmbientLightProbe> {
        return THREE.AmbientLightProbe;
    }
    
}
