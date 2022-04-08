// GENERATED
import {
    AnyConstructor,
    NgtCommonMaterial,
    provideCommonMaterialFactory,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-mesh-matcap-material',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonMaterialFactory<
            THREE.MeshMatcapMaterial,
            THREE.MeshMatcapMaterialParameters
        >(NgtMeshMatcapMaterial),
    ],
})
export class NgtMeshMatcapMaterial extends NgtCommonMaterial<
    THREE.MeshMatcapMaterialParameters,
    THREE.MeshMatcapMaterial
> {
    static ngAcceptInputType_parameters:
        | THREE.MeshMatcapMaterialParameters
        | undefined;

    get materialType(): AnyConstructor<THREE.MeshMatcapMaterial> {
        return THREE.MeshMatcapMaterial;
    }
}

@NgModule({
    declarations: [NgtMeshMatcapMaterial],
    exports: [NgtMeshMatcapMaterial],
})
export class NgtMeshMatcapMaterialModule {}
