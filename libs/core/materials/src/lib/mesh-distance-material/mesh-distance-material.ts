// GENERATED
import {
    AnyConstructor,
    NgtCommonMaterial,
    provideCommonMaterialFactory,
} from '@angular-three/core';
import {
    ChangeDetectionStrategy,
    Component,
    NgModule,
    Input,
} from '@angular/core';
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

    @Input() set map(map: THREE.Texture | null) {
        this.set({ map });
    }

    @Input() set alphaMap(alphaMap: THREE.Texture | null) {
        this.set({ alphaMap });
    }

    @Input() set displacementMap(displacementMap: THREE.Texture | null) {
        this.set({ displacementMap });
    }

    @Input() set displacementScale(displacementScale: number) {
        this.set({ displacementScale });
    }

    @Input() set displacementBias(displacementBias: number) {
        this.set({ displacementBias });
    }

    @Input() set farDistance(farDistance: number) {
        this.set({ farDistance });
    }

    @Input() set nearDistance(nearDistance: number) {
        this.set({ nearDistance });
    }

    @Input() set referencePosition(referencePosition: THREE.Vector3) {
        this.set({ referencePosition });
    }

    get materialType(): AnyConstructor<THREE.MeshDistanceMaterial> {
        return THREE.MeshDistanceMaterial;
    }

    protected override get subParameters(): Record<string, boolean> {
        return {
            ...super.subParameters,
            map: true,
            alphaMap: true,
            displacementMap: true,
            displacementScale: true,
            displacementBias: true,
            farDistance: true,
            nearDistance: true,
            referencePosition: true,
        };
    }
}

@NgModule({
    declarations: [NgtMeshDistanceMaterial],
    exports: [NgtMeshDistanceMaterial],
})
export class NgtMeshDistanceMaterialModule {}
