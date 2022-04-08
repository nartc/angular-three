// GENERATED
import {
    AnyConstructor,
    NgtCommonMaterial,
    provideCommonMaterialFactory,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-mesh-normal-material',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonMaterialFactory<
            THREE.MeshNormalMaterial,
            THREE.MeshNormalMaterialParameters
        >(NgtMeshNormalMaterial),
    ],
})
export class NgtMeshNormalMaterial extends NgtCommonMaterial<
    THREE.MeshNormalMaterialParameters,
    THREE.MeshNormalMaterial
> {
    static ngAcceptInputType_parameters:
        | THREE.MeshNormalMaterialParameters
        | undefined;

    get materialType(): AnyConstructor<THREE.MeshNormalMaterial> {
        return THREE.MeshNormalMaterial;
    }
}

@NgModule({
    declarations: [NgtMeshNormalMaterial],
    exports: [NgtMeshNormalMaterial],
})
export class NgtMeshNormalMaterialModule {}
