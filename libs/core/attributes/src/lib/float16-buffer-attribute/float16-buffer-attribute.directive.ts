// GENERATED
import { NgtAttribute } from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
    selector: 'ngt-float16-buffer-attribute',
    exportAs: 'ngtFloat16BufferAttribute',
    providers: [
        {
            provide: NgtAttribute,
            useExisting: NgtFloat16BufferAttribute,
        },
    ],
})
export class NgtFloat16BufferAttribute extends NgtAttribute<THREE.Float16BufferAttribute> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.Float16BufferAttribute>
        | undefined;

    @Input() set args(
        v: ConstructorParameters<typeof THREE.Float16BufferAttribute>
    ) {
        this.attributeArgs = v;
    }

    attributeType = THREE.Float16BufferAttribute;
}

@NgModule({
    declarations: [NgtFloat16BufferAttribute],
    exports: [NgtFloat16BufferAttribute],
})
export class NgtFloat16BufferAttributeModule {}
