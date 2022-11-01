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
    selector: '[ngtCameraHelper]',
    standalone: true,
    exportAs: 'ngtCameraHelper',
    providers: [
        provideNgtCommonObjectHelper(NgtCameraHelper),
        provideCommonObjectHelperRef(NgtCameraHelper)
    ],
})
export class NgtCameraHelper extends NgtCommonObjectHelper<THREE.CameraHelper> {
    static ngAcceptInputType_ngtCameraHelper:
        | Tail<ConstructorParameters<typeof THREE.CameraHelper>>
        | ''
        | undefined;

    @Input() set ngtCameraHelper(
        v: Tail<ConstructorParameters<typeof THREE.CameraHelper>> | ''
    ) {
        if (v) {
            this.instanceArgs = v;
        }
    }

    override get objectHelperType(): AnyConstructor<THREE.CameraHelper> {
        return THREE.CameraHelper;
    }
}
