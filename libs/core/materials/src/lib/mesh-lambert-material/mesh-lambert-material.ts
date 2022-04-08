// GENERATED
import {
    AnyConstructor,
    NgtCommonMaterial,
    provideCommonMaterialFactory,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-mesh-lambert-material',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonMaterialFactory<
            THREE.MeshLambertMaterial,
            THREE.MeshLambertMaterialParameters
        >(NgtMeshLambertMaterial),
    ],
})
export class NgtMeshLambertMaterial extends NgtCommonMaterial<
    THREE.MeshLambertMaterialParameters,
    THREE.MeshLambertMaterial
> {
    static ngAcceptInputType_parameters:
        | THREE.MeshLambertMaterialParameters
        | undefined;

    get materialType(): AnyConstructor<THREE.MeshLambertMaterial> {
        return THREE.MeshLambertMaterial;
    }
}

@NgModule({
    declarations: [NgtMeshLambertMaterial],
    exports: [NgtMeshLambertMaterial],
})
export class NgtMeshLambertMaterialModule {}
