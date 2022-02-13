// GENERATED
import { NgtTexture } from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
    selector: 'ngt-cube-texture',
    exportAs: 'ngtCubeTexture',
    providers: [
        {
            provide: NgtTexture,
            useExisting: NgtCubeTexture,
        },
    ],
})
export class NgtCubeTexture extends NgtTexture<THREE.CubeTexture> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.CubeTexture>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.CubeTexture>) {
        this.textureArgs = v;
    }

    textureType = THREE.CubeTexture;
}

@NgModule({
    declarations: [NgtCubeTexture],
    exports: [NgtCubeTexture],
})
export class NgtCubeTextureModule {}
