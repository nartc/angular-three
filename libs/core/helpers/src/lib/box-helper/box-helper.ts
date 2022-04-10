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
    selector: '[ngtBoxHelper]',
    exportAs: 'ngtBoxHelper',
    providers: [
        provideCommonObjectHelperFactory<THREE.BoxHelper>(NgtBoxHelper),
    ],
})
export class NgtBoxHelper extends NgtCommonObjectHelper<THREE.BoxHelper> {
    static ngAcceptInputType_ngtBoxHelper:
        | Tail<ConstructorParameters<typeof THREE.BoxHelper>>
        | ''
        | undefined;

    @Input() set ngtBoxHelper(
        v: Tail<ConstructorParameters<typeof THREE.BoxHelper>> | ''
    ) {
        if (v) {
            this.instanceArgs = v;
        }
    }

    override get objectHelperType(): AnyConstructor<THREE.BoxHelper> {
        return THREE.BoxHelper;
    }
}

@NgModule({
    declarations: [NgtBoxHelper],
    exports: [NgtBoxHelper],
})
export class NgtBoxHelperModule {}
