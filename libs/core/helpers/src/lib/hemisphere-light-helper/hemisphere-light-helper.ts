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
    selector: '[ngtHemisphereLightHelper]',
    exportAs: 'ngtHemisphereLightHelper',
    providers: [
        provideCommonObjectHelperFactory<THREE.HemisphereLightHelper>(
            NgtHemisphereLightHelper
        ),
    ],
})
export class NgtHemisphereLightHelper extends NgtCommonObjectHelper<THREE.HemisphereLightHelper> {
    static ngAcceptInputType_ngtHemisphereLightHelper:
        | Tail<ConstructorParameters<typeof THREE.HemisphereLightHelper>>
        | ''
        | undefined;

    @Input() set ngtHemisphereLightHelper(
        v: Tail<ConstructorParameters<typeof THREE.HemisphereLightHelper>> | ''
    ) {
        if (v) {
            this.instanceArgs = v;
        }
    }

    override get objectHelperType(): AnyConstructor<THREE.HemisphereLightHelper> {
        return THREE.HemisphereLightHelper;
    }
}

@NgModule({
    declarations: [NgtHemisphereLightHelper],
    exports: [NgtHemisphereLightHelper],
})
export class NgtHemisphereLightHelperModule {}
