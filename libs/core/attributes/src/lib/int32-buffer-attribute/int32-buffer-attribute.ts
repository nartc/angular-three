// GENERATED
import {
    AnyConstructor,
    NgtCommonAttribute,
    provideCommonAttributeRef,
} from '@angular-three/core';
import { NgModule, Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-int32-buffer-attribute',
    template: '<ng-content></ng-content>',
    providers: [provideCommonAttributeRef(NgtInt32BufferAttribute)],
})
export class NgtInt32BufferAttribute extends NgtCommonAttribute<THREE.Int32BufferAttribute> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.Int32BufferAttribute>
        | undefined;

    @Input() set args(
        v: ConstructorParameters<typeof THREE.Int32BufferAttribute>
    ) {
        this.instanceArgs = v;
    }

    override get attributeType(): AnyConstructor<THREE.Int32BufferAttribute> {
        return THREE.Int32BufferAttribute;
    }
}

@NgModule({
    declarations: [NgtInt32BufferAttribute],
    exports: [NgtInt32BufferAttribute],
})
export class NgtInt32BufferAttributeModule {}
