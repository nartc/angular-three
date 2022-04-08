// GENERATED
import {
    AnyConstructor,
    NgtCommonMaterial,
    provideCommonMaterialFactory,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-mesh-distance-material',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonMaterialFactory<
            THREE.MeshDistanceMaterial,
            THREE.MeshDistanceMaterialParameters
        >(NgtMeshDistanceMaterial),
    ],
})
export class NgtMeshDistanceMaterial extends NgtCommonMaterial<
    THREE.MeshDistanceMaterialParameters,
    THREE.MeshDistanceMaterial
> {
    static ngAcceptInputType_parameters:
        | THREE.MeshDistanceMaterialParameters
        | undefined;

    get materialType(): AnyConstructor<THREE.MeshDistanceMaterial> {
        return THREE.MeshDistanceMaterial;
    }
}

@NgModule({
    declarations: [NgtMeshDistanceMaterial],
    exports: [NgtMeshDistanceMaterial],
})
export class NgtMeshDistanceMaterialModule {}
