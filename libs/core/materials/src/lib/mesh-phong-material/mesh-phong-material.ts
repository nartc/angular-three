// GENERATED
import {
    AnyConstructor,
    NgtCommonMaterial,
    provideCommonMaterialFactory,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-mesh-phong-material',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonMaterialFactory<
            THREE.MeshPhongMaterial,
            THREE.MeshPhongMaterialParameters
        >(NgtMeshPhongMaterial),
    ],
})
export class NgtMeshPhongMaterial extends NgtCommonMaterial<
    THREE.MeshPhongMaterialParameters,
    THREE.MeshPhongMaterial
> {
    static ngAcceptInputType_parameters:
        | THREE.MeshPhongMaterialParameters
        | undefined;

    get materialType(): AnyConstructor<THREE.MeshPhongMaterial> {
        return THREE.MeshPhongMaterial;
    }
}

@NgModule({
    declarations: [NgtMeshPhongMaterial],
    exports: [NgtMeshPhongMaterial],
})
export class NgtMeshPhongMaterialModule {}
