// GENERATED
import {
    AnyConstructor,
    NgtCommonAttribute,
    provideCommonAttributeFactory,
} from '@angular-three/core';
import { NgModule, Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-instanced-buffer-attribute',
    template: '<ng-content></ng-content>',
    providers: [
        provideCommonAttributeFactory<THREE.InstancedBufferAttribute>(
            NgtInstancedBufferAttribute
        ),
    ],
})
export class NgtInstancedBufferAttribute extends NgtCommonAttribute<THREE.InstancedBufferAttribute> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.InstancedBufferAttribute>
        | undefined;

    @Input() set args(
        v: ConstructorParameters<typeof THREE.InstancedBufferAttribute>
    ) {
        this.instanceArgs = v;
    }

    override get attributeType(): AnyConstructor<THREE.InstancedBufferAttribute> {
        return THREE.InstancedBufferAttribute;
    }
}

@NgModule({
    declarations: [NgtInstancedBufferAttribute],
    exports: [NgtInstancedBufferAttribute],
})
export class NgtInstancedBufferAttributeModule {}
