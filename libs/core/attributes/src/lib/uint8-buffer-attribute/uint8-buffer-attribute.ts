// GENERATED
import {
    AnyConstructor,
    NgtCommonAttribute,
    provideCommonAttributeFactory,
} from '@angular-three/core';
import { NgModule, Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-uint8-buffer-attribute',
    template: '<ng-content></ng-content>',
    providers: [
        provideCommonAttributeFactory<THREE.Uint8BufferAttribute>(
            NgtUint8BufferAttribute
        ),
    ],
})
export class NgtUint8BufferAttribute extends NgtCommonAttribute<THREE.Uint8BufferAttribute> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.Uint8BufferAttribute>
        | undefined;

    @Input() set args(
        v: ConstructorParameters<typeof THREE.Uint8BufferAttribute>
    ) {
        this.instanceArgs = v;
    }

    override get attributeType(): AnyConstructor<THREE.Uint8BufferAttribute> {
        return THREE.Uint8BufferAttribute;
    }
}

@NgModule({
    declarations: [NgtUint8BufferAttribute],
    exports: [NgtUint8BufferAttribute],
})
export class NgtUint8BufferAttributeModule {}
