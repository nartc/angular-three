// GENERATED
import {
    AnyConstructor,
    NgtCommonObjectHelper,
    provideNgtCommonObjectHelper,
    provideCommonObjectHelperRef,
    Tail,
} from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
    selector: '[ngtPlaneHelper]',
    standalone: true,
    exportAs: 'ngtPlaneHelper',
    providers: [
        provideNgtCommonObjectHelper(NgtPlaneHelper),
        provideCommonObjectHelperRef(NgtPlaneHelper)
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
