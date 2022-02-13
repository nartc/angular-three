// GENERATED
import { NgtMaterial } from '@angular-three/core';
import { NgModule, Directive } from '@angular/core';
import * as THREE from 'three';

@Directive({
    selector: 'ngt-shader-material',
    exportAs: 'ngtShaderMaterial',
    providers: [
        {
            provide: NgtMaterial,
            useExisting: NgtShaderMaterial,
        },
    ],
})
export class NgtShaderMaterial extends NgtMaterial<
    THREE.ShaderMaterialParameters,
    THREE.ShaderMaterial
> {
    static ngAcceptInputType_parameters:
        | THREE.ShaderMaterialParameters
        | undefined;

    materialType = THREE.ShaderMaterial;
}

@NgModule({
    declarations: [NgtShaderMaterial],
    exports: [NgtShaderMaterial],
})
export class NgtShaderMaterialModule {}
