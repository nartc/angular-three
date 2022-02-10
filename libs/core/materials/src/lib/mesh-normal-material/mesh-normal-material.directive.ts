// GENERATED
import { NGT_OBJECT_PROVIDER, NgtMaterial } from '@angular-three/core';
import { NgModule, Directive } from '@angular/core';
import * as THREE from 'three';

@Directive({
    selector: 'ngt-mesh-normal-material',
    exportAs: 'ngtMeshNormalMaterial',
    providers: [
        {
            provide: NgtMaterial,
            useExisting: NgtMeshNormalMaterial,
        },
        NGT_OBJECT_PROVIDER,
    ],
})
export class NgtMeshNormalMaterial extends NgtMaterial<
    THREE.MeshNormalMaterialParameters,
    THREE.MeshNormalMaterial
> {
    static ngAcceptInputType_parameters:
        | THREE.MeshNormalMaterialParameters
        | undefined;

    materialType = THREE.MeshNormalMaterial;
}

@NgModule({
    declarations: [NgtMeshNormalMaterial],
    exports: [NgtMeshNormalMaterial],
})
export class NgtMeshNormalMaterialModule {}
