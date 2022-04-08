// GENERATED
import {
    AnyConstructor,
    NgtCommonMaterial,
    provideCommonMaterialFactory,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-mesh-standard-material',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonMaterialFactory<
            THREE.MeshStandardMaterial,
            THREE.MeshStandardMaterialParameters
        >(NgtMeshStandardMaterial),
    ],
})
export class NgtMeshStandardMaterial extends NgtCommonMaterial<
    THREE.MeshStandardMaterialParameters,
    THREE.MeshStandardMaterial
> {
    static ngAcceptInputType_parameters:
        | THREE.MeshStandardMaterialParameters
        | undefined;

    get materialType(): AnyConstructor<THREE.MeshStandardMaterial> {
        return THREE.MeshStandardMaterial;
    }
}

@NgModule({
    declarations: [NgtMeshStandardMaterial],
    exports: [NgtMeshStandardMaterial],
})
export class NgtMeshStandardMaterialModule {}
