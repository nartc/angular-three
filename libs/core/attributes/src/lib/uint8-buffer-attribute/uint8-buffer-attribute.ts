// GENERATED
import {
    AnyConstructor,
    NgtCommonAttribute,
    provideCommonAttributeRef,
} from '@angular-three/core';
import { NgModule, Component } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-uint8-buffer-attribute',
    template: '<ng-content></ng-content>',
    providers: [provideCommonAttributeRef(NgtUint8BufferAttribute)],
})
export class NgtUint8BufferAttribute extends NgtCommonAttribute<THREE.Uint8BufferAttribute> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.Uint8BufferAttribute>
        | undefined;

    override get attributeType(): AnyConstructor<THREE.Uint8BufferAttribute> {
        return THREE.Uint8BufferAttribute;
    }
}

@NgModule({
    declarations: [NgtUint8BufferAttribute],
    exports: [NgtUint8BufferAttribute],
})
export class NgtUint8BufferAttributeModule {}
