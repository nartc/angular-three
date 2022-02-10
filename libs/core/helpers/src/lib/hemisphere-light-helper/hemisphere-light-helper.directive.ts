// GENERATED
import {
    NGT_OBJECT_PROVIDER,
    NgtObjectHelper,
    Tail,
} from '@angular-three/core';
import { Directive, Input, NgModule } from '@angular/core';
import * as THREE from 'three';

@Directive({
    selector: '[ngtHemisphereLightHelper]',
    exportAs: 'ngtHemisphereLightHelper',
    providers: [
        {
            provide: NgtObjectHelper,
            useExisting: NgtHemisphereLightHelper,
        },
        NGT_OBJECT_PROVIDER,
    ],
})
export class NgtHemisphereLightHelper extends NgtObjectHelper<THREE.HemisphereLightHelper> {
    static ngAcceptInputType_ngtHemisphereLightHelper:
        | Tail<ConstructorParameters<typeof THREE.HemisphereLightHelper>>
        | ''
        | undefined;

    @Input() set ngtHemisphereLightHelper(
        v: Tail<ConstructorParameters<typeof THREE.HemisphereLightHelper>> | ''
    ) {
        if (v) {
            this.objectHelperArgs = v;
        }
    }

    objectHelperType = THREE.HemisphereLightHelper;
}

@NgModule({
    declarations: [NgtHemisphereLightHelper],
    exports: [NgtHemisphereLightHelper],
})
export class NgtHemisphereLightHelperModule {}
