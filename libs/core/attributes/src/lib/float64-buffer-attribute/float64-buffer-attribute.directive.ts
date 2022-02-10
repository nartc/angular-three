// GENERATED
import { NgtAttribute } from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
    selector: 'ngt-float64-buffer-attribute',
    exportAs: 'ngtFloat64BufferAttribute',
    providers: [
        {
            provide: NgtAttribute,
            useExisting: NgtFloat64BufferAttribute,
        },
    ],
})
export class NgtFloat64BufferAttribute extends NgtAttribute<THREE.Float64BufferAttribute> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.Float64BufferAttribute>
        | undefined;

    @Input() set args(
        v: ConstructorParameters<typeof THREE.Float64BufferAttribute>
    ) {
        this.attributeArgs = v;
    }

    attributeType = THREE.Float64BufferAttribute;
}

@NgModule({
    declarations: [NgtFloat64BufferAttribute],
    exports: [NgtFloat64BufferAttribute],
})
export class NgtFloat64BufferAttributeModule {}
