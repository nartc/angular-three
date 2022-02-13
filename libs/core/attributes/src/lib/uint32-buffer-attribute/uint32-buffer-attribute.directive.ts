// GENERATED
import { NgtAttribute } from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
    selector: 'ngt-uint32-buffer-attribute',
    exportAs: 'ngtUint32BufferAttribute',
    providers: [
        {
            provide: NgtAttribute,
            useExisting: NgtUint32BufferAttribute,
        },
    ],
})
export class NgtUint32BufferAttribute extends NgtAttribute<THREE.Uint32BufferAttribute> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.Uint32BufferAttribute>
        | undefined;

    @Input() set args(
        v: ConstructorParameters<typeof THREE.Uint32BufferAttribute>
    ) {
        this.attributeArgs = v;
    }

    attributeType = THREE.Uint32BufferAttribute;
}

@NgModule({
    declarations: [NgtUint32BufferAttribute],
    exports: [NgtUint32BufferAttribute],
})
export class NgtUint32BufferAttributeModule {}
