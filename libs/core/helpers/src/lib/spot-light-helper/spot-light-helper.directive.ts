// GENERATED
import {
    NGT_OBJECT_PROVIDER,
    NgtObjectHelper,
    Tail,
} from '@angular-three/core';
import { Directive, Input, NgModule } from '@angular/core';
import * as THREE from 'three';

@Directive({
    selector: '[ngtSpotLightHelper]',
    exportAs: 'ngtSpotLightHelper',
    providers: [
        {
            provide: NgtObjectHelper,
            useExisting: NgtSpotLightHelper,
        },
        NGT_OBJECT_PROVIDER,
    ],
})
export class NgtSpotLightHelper extends NgtObjectHelper<THREE.SpotLightHelper> {
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

    objectHelperType = THREE.SpotLightHelper;
}

@NgModule({
    declarations: [NgtSpotLightHelper],
    exports: [NgtSpotLightHelper],
})
export class NgtSpotLightHelperModule {}
