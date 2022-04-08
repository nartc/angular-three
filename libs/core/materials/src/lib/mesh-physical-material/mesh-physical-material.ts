// GENERATED
import {
    AnyConstructor,
    NgtCommonMaterial,
    provideCommonMaterialFactory,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-mesh-physical-material',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonMaterialFactory<
            THREE.MeshPhysicalMaterial,
            THREE.MeshPhysicalMaterialParameters
        >(NgtMeshPhysicalMaterial),
    ],
})
export class NgtMeshPhysicalMaterial extends NgtCommonMaterial<
    THREE.MeshPhysicalMaterialParameters,
    THREE.MeshPhysicalMaterial
> {
    static ngAcceptInputType_parameters:
        | THREE.MeshPhysicalMaterialParameters
        | undefined;

    get materialType(): AnyConstructor<THREE.MeshPhysicalMaterial> {
        return THREE.MeshPhysicalMaterial;
    }
}

@NgModule({
    declarations: [NgtMeshPhysicalMaterial],
    exports: [NgtMeshPhysicalMaterial],
})
export class NgtMeshPhysicalMaterialModule {}
