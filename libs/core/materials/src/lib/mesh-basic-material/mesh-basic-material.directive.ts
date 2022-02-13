// GENERATED
import { NgtMaterial } from '@angular-three/core';
import { NgModule, Directive } from '@angular/core';
import * as THREE from 'three';

@Directive({
    selector: 'ngt-mesh-basic-material',
    exportAs: 'ngtMeshBasicMaterial',
    providers: [
        {
            provide: NgtMaterial,
            useExisting: NgtMeshBasicMaterial,
        },
    ],
})
export class NgtMeshBasicMaterial extends NgtMaterial<
    THREE.MeshBasicMaterialParameters,
    THREE.MeshBasicMaterial
> {
    static ngAcceptInputType_parameters:
        | THREE.MeshBasicMaterialParameters
        | undefined;

    materialType = THREE.MeshBasicMaterial;
}

@NgModule({
    declarations: [NgtMeshBasicMaterial],
    exports: [NgtMeshBasicMaterial],
})
export class NgtMeshBasicMaterialModule {}
