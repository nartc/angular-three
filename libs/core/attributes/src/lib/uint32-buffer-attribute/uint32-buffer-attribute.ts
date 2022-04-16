// GENERATED
import {
    AnyConstructor,
    NgtCommonAttribute,
    provideCommonAttributeRef,
} from '@angular-three/core';
import { NgModule, Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-uint32-buffer-attribute',
    template: '<ng-content></ng-content>',
    providers: [provideCommonAttributeRef(NgtUint32BufferAttribute)],
})
export class NgtUint32BufferAttribute extends NgtCommonAttribute<THREE.Uint32BufferAttribute> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.Uint32BufferAttribute>
        | undefined;

    @Input() set args(
        v: ConstructorParameters<typeof THREE.Uint32BufferAttribute>
    ) {
        this.instanceArgs = v;
    }

    override get attributeType(): AnyConstructor<THREE.Uint32BufferAttribute> {
        return THREE.Uint32BufferAttribute;
    }
}

@NgModule({
    declarations: [NgtUint32BufferAttribute],
    exports: [NgtUint32BufferAttribute],
})
export class NgtUint32BufferAttributeModule {}
