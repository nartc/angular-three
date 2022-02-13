// GENERATED
import { NgtTexture } from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
    selector: 'ngt-data-texture2-darray',
    exportAs: 'ngtDataTexture2DArray',
    providers: [
        {
            provide: NgtTexture,
            useExisting: NgtDataTexture2DArray,
        },
    ],
})
export class NgtDataTexture2DArray extends NgtTexture<THREE.DataTexture2DArray> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.DataTexture2DArray>
        | undefined;

    @Input() set args(
        v: ConstructorParameters<typeof THREE.DataTexture2DArray>
    ) {
        this.textureArgs = v;
    }

    textureType = THREE.DataTexture2DArray;
}

@NgModule({
    declarations: [NgtDataTexture2DArray],
    exports: [NgtDataTexture2DArray],
})
export class NgtDataTexture2DArrayModule {}
