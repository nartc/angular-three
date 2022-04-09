// GENERATED
import {
    AnyConstructor,
    NgtCommonObjectHelper,
    provideCommonObjectHelperFactory,
    Tail,
} from '@angular-three/core';
import { Directive, Input, NgModule } from '@angular/core';
import * as THREE from 'three';

@Directive({
    selector: '[ngtSpotLightHelper]',
    exportAs: 'ngtSpotLightHelper',
    providers: [
        provideCommonObjectHelperFactory<THREE.SpotLightHelper>(
            NgtSpotLightHelper
        ),
    ],
})
export class NgtSpotLightHelper extends NgtCommonObjectHelper<THREE.SpotLightHelper> {
    static ngAcceptInputType_ngtSpotLightHelper:
        | Tail<ConstructorParameters<typeof THREE.SpotLightHelper>>
        | ''
        | undefined;

    @Input() set ngtSpotLightHelper(
        v: Tail<ConstructorParameters<typeof THREE.SpotLightHelper>> | ''
    ) {
        if (v) {
            this.objectHelperArgs = v;
        }
    }

    override get objectHelperType(): AnyConstructor<THREE.SpotLightHelper> {
        return THREE.SpotLightHelper;
    }
}

@NgModule({
    declarations: [NgtSpotLightHelper],
    exports: [NgtSpotLightHelper],
})
export class NgtSpotLightHelperModule {}
