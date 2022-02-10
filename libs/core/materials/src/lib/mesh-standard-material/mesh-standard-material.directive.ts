// GENERATED
import { NGT_OBJECT_PROVIDER, NgtMaterial } from '@angular-three/core';
import { NgModule, Directive } from '@angular/core';
import * as THREE from 'three';

@Directive({
    selector: 'ngt-mesh-standard-material',
    exportAs: 'ngtMeshStandardMaterial',
    providers: [
        {
            provide: NgtMaterial,
            useExisting: NgtMeshStandardMaterial,
        },
        NGT_OBJECT_PROVIDER,
    ],
})
export class NgtMeshStandardMaterial extends NgtMaterial<
    THREE.MeshStandardMaterialParameters,
    THREE.MeshStandardMaterial
> {
    static ngAcceptInputType_parameters:
        | THREE.MeshStandardMaterialParameters
        | undefined;

    materialType = THREE.MeshStandardMaterial;
}

@NgModule({
    declarations: [NgtMeshStandardMaterial],
    exports: [NgtMeshStandardMaterial],
})
export class NgtMeshStandardMaterialModule {}
