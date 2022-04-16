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
    selector: '[ngtDirectionalLightHelper]',
    exportAs: 'ngtDirectionalLightHelper',
    providers: [provideCommonObjectHelperRef(NgtDirectionalLightHelper)],
})
export class NgtDirectionalLightHelper extends NgtCommonObjectHelper<THREE.DirectionalLightHelper> {
    static ngAcceptInputType_ngtDirectionalLightHelper:
        | Tail<ConstructorParameters<typeof THREE.DirectionalLightHelper>>
        | ''
        | undefined;

    @Input() set ngtDirectionalLightHelper(
        v: Tail<ConstructorParameters<typeof THREE.DirectionalLightHelper>> | ''
    ) {
        if (v) {
            this.instanceArgs = v;
        }
    }

    override get objectHelperType(): AnyConstructor<THREE.DirectionalLightHelper> {
        return THREE.DirectionalLightHelper;
    }
}

@NgModule({
    declarations: [NgtDirectionalLightHelper],
    exports: [NgtDirectionalLightHelper],
})
export class NgtDirectionalLightHelperModule {}
