// GENERATED
import {
    AnyConstructor,
    NgtCommonAttribute,
    provideCommonAttributeRef,
} from '@angular-three/core';
import { NgModule, Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-uint8-clamped-buffer-attribute',
    template: '<ng-content></ng-content>',
    providers: [provideCommonAttributeRef(NgtUint8ClampedBufferAttribute)],
})
export class NgtUint8ClampedBufferAttribute extends NgtCommonAttribute<THREE.Uint8ClampedBufferAttribute> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.Uint8ClampedBufferAttribute>
        | undefined;

    @Input() set args(
        v: ConstructorParameters<typeof THREE.Uint8ClampedBufferAttribute>
    ) {
        this.instanceArgs = v;
    }

    override get attributeType(): AnyConstructor<THREE.Uint8ClampedBufferAttribute> {
        return THREE.Uint8ClampedBufferAttribute;
    }
}

@NgModule({
    declarations: [NgtUint8ClampedBufferAttribute],
    exports: [NgtUint8ClampedBufferAttribute],
})
export class NgtUint8ClampedBufferAttributeModule {}
