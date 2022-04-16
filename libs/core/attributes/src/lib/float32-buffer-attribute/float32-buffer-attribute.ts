// GENERATED
import {
    AnyConstructor,
    NgtCommonAttribute,
    provideCommonAttributeRef,
} from '@angular-three/core';
import { NgModule, Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-float32-buffer-attribute',
    template: '<ng-content></ng-content>',
    providers: [provideCommonAttributeRef(NgtFloat32BufferAttribute)],
})
export class NgtFloat32BufferAttribute extends NgtCommonAttribute<THREE.Float32BufferAttribute> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.Float32BufferAttribute>
        | undefined;

    @Input() set args(
        v: ConstructorParameters<typeof THREE.Float32BufferAttribute>
    ) {
        this.instanceArgs = v;
    }

    override get attributeType(): AnyConstructor<THREE.Float32BufferAttribute> {
        return THREE.Float32BufferAttribute;
    }
}

@NgModule({
    declarations: [NgtFloat32BufferAttribute],
    exports: [NgtFloat32BufferAttribute],
})
export class NgtFloat32BufferAttributeModule {}
