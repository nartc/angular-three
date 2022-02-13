// GENERATED
import { NgtObjectHelper, Tail } from '@angular-three/core';
import { Directive, Input, NgModule } from '@angular/core';
import * as THREE from 'three';

@Directive({
    selector: '[ngtPointLightHelper]',
    exportAs: 'ngtPointLightHelper',
    providers: [
        {
            provide: NgtObjectHelper,
            useExisting: NgtPointLightHelper,
        },
    ],
})
export class NgtPointLightHelper extends NgtObjectHelper<THREE.PointLightHelper> {
    static ngAcceptInputType_ngtPointLightHelper:
        | Tail<ConstructorParameters<typeof THREE.PointLightHelper>>
        | ''
        | undefined;

    @Input() set ngtPointLightHelper(
        v: Tail<ConstructorParameters<typeof THREE.PointLightHelper>> | ''
    ) {
        if (v) {
            this.objectHelperArgs = v;
        }
    }

    objectHelperType = THREE.PointLightHelper;
}

@NgModule({
    declarations: [NgtPointLightHelper],
    exports: [NgtPointLightHelper],
})
export class NgtPointLightHelperModule {}
