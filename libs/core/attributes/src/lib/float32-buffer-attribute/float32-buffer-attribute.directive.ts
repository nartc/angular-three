// GENERATED
import { NgtAttribute } from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
    selector: 'ngt-float32-buffer-attribute',
    exportAs: 'ngtFloat32BufferAttribute',
    providers: [
        {
            provide: NgtAttribute,
            useExisting: NgtFloat32BufferAttribute,
        },
    ],
})
export class NgtFloat32BufferAttribute extends NgtAttribute<THREE.Float32BufferAttribute> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.Float32BufferAttribute>
        | undefined;

    @Input() set args(
        v: ConstructorParameters<typeof THREE.Float32BufferAttribute>
    ) {
        this.attributeArgs = v;
    }

    attributeType = THREE.Float32BufferAttribute;
}

@NgModule({
    declarations: [NgtFloat32BufferAttribute],
    exports: [NgtFloat32BufferAttribute],
})
export class NgtFloat32BufferAttributeModule {}
