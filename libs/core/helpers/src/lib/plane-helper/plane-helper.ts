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
    selector: '[ngtPlaneHelper]',
    exportAs: 'ngtPlaneHelper',
    providers: [
        provideCommonObjectHelperFactory<THREE.PlaneHelper>(NgtPlaneHelper),
    ],
})
export class NgtPlaneHelper extends NgtCommonObjectHelper<THREE.PlaneHelper> {
    static ngAcceptInputType_ngtPlaneHelper:
        | Tail<ConstructorParameters<typeof THREE.PlaneHelper>>
        | ''
        | undefined;

    @Input() set ngtPlaneHelper(
        v: Tail<ConstructorParameters<typeof THREE.PlaneHelper>> | ''
    ) {
        if (v) {
            this.instanceArgs = v;
        }
    }

    override get objectHelperType(): AnyConstructor<THREE.PlaneHelper> {
        return THREE.PlaneHelper;
    }
}

@NgModule({
    declarations: [NgtPlaneHelper],
    exports: [NgtPlaneHelper],
})
export class NgtPlaneHelperModule {}
