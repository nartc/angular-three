// GENERATED
import {
    AnyConstructor,
    NgtCommonMaterial,
    provideCommonMaterialFactory,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-mesh-toon-material',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonMaterialFactory<
            THREE.MeshToonMaterial,
            THREE.MeshToonMaterialParameters
        >(NgtMeshToonMaterial),
    ],
})
export class NgtMeshToonMaterial extends NgtCommonMaterial<
    THREE.MeshToonMaterialParameters,
    THREE.MeshToonMaterial
> {
    static ngAcceptInputType_parameters:
        | THREE.MeshToonMaterialParameters
        | undefined;

    get materialType(): AnyConstructor<THREE.MeshToonMaterial> {
        return THREE.MeshToonMaterial;
    }
}

@NgModule({
    declarations: [NgtMeshToonMaterial],
    exports: [NgtMeshToonMaterial],
})
export class NgtMeshToonMaterialModule {}
