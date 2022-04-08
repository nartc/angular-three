// GENERATED
import {
    AnyConstructor,
    NgtCommonMaterial,
    provideCommonMaterialFactory,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-mesh-basic-material',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonMaterialFactory<
            THREE.MeshBasicMaterial,
            THREE.MeshBasicMaterialParameters
        >(NgtMeshBasicMaterial),
    ],
})
export class NgtMeshBasicMaterial extends NgtCommonMaterial<
    THREE.MeshBasicMaterialParameters,
    THREE.MeshBasicMaterial
> {
    static ngAcceptInputType_parameters:
        | THREE.MeshBasicMaterialParameters
        | undefined;

    get materialType(): AnyConstructor<THREE.MeshBasicMaterial> {
        return THREE.MeshBasicMaterial;
    }
}

@NgModule({
    declarations: [NgtMeshBasicMaterial],
    exports: [NgtMeshBasicMaterial],
})
export class NgtMeshBasicMaterialModule {}
