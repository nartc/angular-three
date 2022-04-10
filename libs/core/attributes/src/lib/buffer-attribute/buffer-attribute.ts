// GENERATED
import {
    AnyConstructor,
    NgtCommonAttribute,
    provideCommonAttributeFactory,
} from '@angular-three/core';
import { NgModule, Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-buffer-attribute',
    template: '<ng-content></ng-content>',
    providers: [
        provideCommonAttributeFactory<THREE.BufferAttribute>(
            NgtBufferAttribute
        ),
    ],
})
export class NgtBufferAttribute extends NgtCommonAttribute<THREE.BufferAttribute> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.BufferAttribute>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.BufferAttribute>) {
        this.instanceArgs = v;
    }

    override get attributeType(): AnyConstructor<THREE.BufferAttribute> {
        return THREE.BufferAttribute;
    }
}

@NgModule({
    declarations: [NgtBufferAttribute],
    exports: [NgtBufferAttribute],
})
export class NgtBufferAttributeModule {}
