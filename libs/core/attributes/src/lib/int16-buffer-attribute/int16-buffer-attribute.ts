// GENERATED
import {
    AnyConstructor,
    NgtCommonAttribute,
    provideCommonAttributeRef,
} from '@angular-three/core';
import { NgModule, Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-int16-buffer-attribute',
    template: '<ng-content></ng-content>',
    providers: [provideCommonAttributeRef(NgtInt16BufferAttribute)],
})
export class NgtInt16BufferAttribute extends NgtCommonAttribute<THREE.Int16BufferAttribute> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.Int16BufferAttribute>
        | undefined;

    @Input() set args(
        v: ConstructorParameters<typeof THREE.Int16BufferAttribute>
    ) {
        this.instanceArgs = v;
    }

    override get attributeType(): AnyConstructor<THREE.Int16BufferAttribute> {
        return THREE.Int16BufferAttribute;
    }
}

@NgModule({
    declarations: [NgtInt16BufferAttribute],
    exports: [NgtInt16BufferAttribute],
})
export class NgtInt16BufferAttributeModule {}
