// GENERATED
import {
    AnyConstructor,
    NgtCommonAttribute,
    provideCommonAttributeFactory,
} from '@angular-three/core';
import { NgModule, Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-interleaved-buffer-attribute',
    template: '<ng-content></ng-content>',
    providers: [
        provideCommonAttributeFactory<THREE.InterleavedBufferAttribute>(
            NgtInterleavedBufferAttribute
        ),
    ],
})
export class NgtInterleavedBufferAttribute extends NgtCommonAttribute<THREE.InterleavedBufferAttribute> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.InterleavedBufferAttribute>
        | undefined;

    @Input() set args(
        v: ConstructorParameters<typeof THREE.InterleavedBufferAttribute>
    ) {
        this.attributeArgs = v;
    }

    override get attributeType(): AnyConstructor<THREE.InterleavedBufferAttribute> {
        return THREE.InterleavedBufferAttribute;
    }
}

@NgModule({
    declarations: [NgtInterleavedBufferAttribute],
    exports: [NgtInterleavedBufferAttribute],
})
export class NgtInterleavedBufferAttributeModule {}
