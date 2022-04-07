// GENERATED
import {
    AnyConstructor,
    NgtCommonAttribute,
    provideCommonAttributeFactory,
} from '@angular-three/core';
import { NgModule, Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-float64-buffer-attribute',
    template: '<ng-content></ng-content>',
    providers: [
        provideCommonAttributeFactory<THREE.Float64BufferAttribute>(
            NgtFloat64BufferAttribute
        ),
    ],
})
export class NgtFloat64BufferAttribute extends NgtCommonAttribute<THREE.Float64BufferAttribute> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.Float64BufferAttribute>
        | undefined;

    @Input() set args(
        v: ConstructorParameters<typeof THREE.Float64BufferAttribute>
    ) {
        this.attributeArgs = v;
    }

    override get attributeType(): AnyConstructor<THREE.Float64BufferAttribute> {
        return THREE.Float64BufferAttribute;
    }
}

@NgModule({
    declarations: [NgtFloat64BufferAttribute],
    exports: [NgtFloat64BufferAttribute],
})
export class NgtFloat64BufferAttributeModule {}
