// GENERATED
import {
    AnyConstructor,
    NgtCommonAttribute,
    provideCommonAttributeFactory,
} from '@angular-three/core';
import { NgModule, Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-int8-buffer-attribute',
    template: '<ng-content></ng-content>',
    providers: [
        provideCommonAttributeFactory<THREE.Int8BufferAttribute>(
            NgtInt8BufferAttribute
        ),
    ],
})
export class NgtInt8BufferAttribute extends NgtCommonAttribute<THREE.Int8BufferAttribute> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.Int8BufferAttribute>
        | undefined;

    @Input() set args(
        v: ConstructorParameters<typeof THREE.Int8BufferAttribute>
    ) {
        this.instanceArgs = v;
    }

    override get attributeType(): AnyConstructor<THREE.Int8BufferAttribute> {
        return THREE.Int8BufferAttribute;
    }
}

@NgModule({
    declarations: [NgtInt8BufferAttribute],
    exports: [NgtInt8BufferAttribute],
})
export class NgtInt8BufferAttributeModule {}
