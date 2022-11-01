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
    selector: '[ngtSkeletonHelper]',
    standalone: true,
    exportAs: 'ngtSkeletonHelper',
    providers: [
        provideNgtCommonObjectHelper(NgtSkeletonHelper),
        provideCommonObjectHelperRef(NgtSkeletonHelper)
    ],
})
export class NgtSkeletonHelper extends NgtCommonObjectHelper<THREE.SkeletonHelper> {
    static ngAcceptInputType_ngtSkeletonHelper:
        | Tail<ConstructorParameters<typeof THREE.SkeletonHelper>>
        | ''
        | undefined;

    @Input() set ngtSkeletonHelper(
        v: Tail<ConstructorParameters<typeof THREE.SkeletonHelper>> | ''
    ) {
        if (v) {
            this.instanceArgs = v;
        }
    }

    override get objectHelperType(): AnyConstructor<THREE.SkeletonHelper> {
        return THREE.SkeletonHelper;
    }
}
