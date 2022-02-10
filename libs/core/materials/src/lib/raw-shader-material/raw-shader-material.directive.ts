// GENERATED
import { NGT_OBJECT_PROVIDER, NgtMaterial } from '@angular-three/core';
import { NgModule, Directive } from '@angular/core';
import * as THREE from 'three';

@Directive({
    selector: 'ngt-raw-shader-material',
    exportAs: 'ngtRawShaderMaterial',
    providers: [
        {
            provide: NgtMaterial,
            useExisting: NgtRawShaderMaterial,
        },
        NGT_OBJECT_PROVIDER,
    ],
})
export class NgtRawShaderMaterial extends NgtMaterial<
    THREE.ShaderMaterialParameters,
    THREE.RawShaderMaterial
> {
    static ngAcceptInputType_parameters:
        | THREE.ShaderMaterialParameters
        | undefined;

    materialType = THREE.RawShaderMaterial;
}

@NgModule({
    declarations: [NgtRawShaderMaterial],
    exports: [NgtRawShaderMaterial],
})
export class NgtRawShaderMaterialModule {}
