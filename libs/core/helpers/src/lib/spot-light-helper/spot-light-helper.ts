// GENERATED
import {
    AnyConstructor,
    NgtCommonObjectHelper,
    provideCommonObjectHelperRef,
    Tail,
} from '@angular-three/core';
import { Directive, Input, NgModule } from '@angular/core';
import * as THREE from 'three';

@Directive({
    selector: '[ngtSpotLightHelper]',
    exportAs: 'ngtSpotLightHelper',
    providers: [provideCommonObjectHelperRef(NgtSpotLightHelper)],
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
            this.instanceArgs = v;
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
