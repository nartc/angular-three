// GENERATED
import {
    AnyConstructor,
    NgtCommonAttribute,
    provideCommonAttributeRef,
} from '@angular-three/core';
import { NgModule, Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-float16-buffer-attribute',
    template: '<ng-content></ng-content>',
    providers: [provideCommonAttributeRef(NgtFloat16BufferAttribute)],
})
export class NgtFloat16BufferAttribute extends NgtCommonAttribute<THREE.Float16BufferAttribute> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.Float16BufferAttribute>
        | undefined;

    @Input() set args(
        v: ConstructorParameters<typeof THREE.Float16BufferAttribute>
    ) {
        this.instanceArgs = v;
    }

    override get attributeType(): AnyConstructor<THREE.Float16BufferAttribute> {
        return THREE.Float16BufferAttribute;
    }
}

@NgModule({
    declarations: [NgtFloat16BufferAttribute],
    exports: [NgtFloat16BufferAttribute],
})
export class NgtFloat16BufferAttributeModule {}
