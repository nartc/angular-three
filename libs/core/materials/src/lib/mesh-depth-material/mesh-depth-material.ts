// GENERATED
import {
    AnyConstructor,
    NgtCommonMaterial,
    provideCommonMaterialFactory,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-mesh-depth-material',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonMaterialFactory<
            THREE.MeshDepthMaterial,
            THREE.MeshDepthMaterialParameters
        >(NgtMeshDepthMaterial),
    ],
})
export class NgtMeshDepthMaterial extends NgtCommonMaterial<
    THREE.MeshDepthMaterialParameters,
    THREE.MeshDepthMaterial
> {
    static ngAcceptInputType_parameters:
        | THREE.MeshDepthMaterialParameters
        | undefined;

    get materialType(): AnyConstructor<THREE.MeshDepthMaterial> {
        return THREE.MeshDepthMaterial;
    }
}

@NgModule({
    declarations: [NgtMeshDepthMaterial],
    exports: [NgtMeshDepthMaterial],
})
export class NgtMeshDepthMaterialModule {}
