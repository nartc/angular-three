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
    selector: '[ngtPointLightHelper]',
    exportAs: 'ngtPointLightHelper',
    providers: [
        provideCommonObjectHelperFactory<THREE.PointLightHelper>(
            NgtPointLightHelper
        ),
    ],
})
export class NgtPointLightHelper extends NgtCommonObjectHelper<THREE.PointLightHelper> {
    static ngAcceptInputType_ngtPointLightHelper:
        | Tail<ConstructorParameters<typeof THREE.PointLightHelper>>
        | ''
        | undefined;

    @Input() set ngtPointLightHelper(
        v: Tail<ConstructorParameters<typeof THREE.PointLightHelper>> | ''
    ) {
        if (v) {
            this.instanceArgs = v;
        }
    }

    override get objectHelperType(): AnyConstructor<THREE.PointLightHelper> {
        return THREE.PointLightHelper;
    }
}

@NgModule({
    declarations: [NgtPointLightHelper],
    exports: [NgtPointLightHelper],
})
export class NgtPointLightHelperModule {}
