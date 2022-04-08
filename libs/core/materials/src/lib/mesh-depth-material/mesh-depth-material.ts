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

    @Input() set map(map: THREE.Texture | null) {
        this.set({ map });
    }

    @Input() set alphaMap(alphaMap: THREE.Texture | null) {
        this.set({ alphaMap });
    }

    @Input() set depthPacking(depthPacking: THREE.DepthPackingStrategies) {
        this.set({ depthPacking });
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

    @Input() set wireframe(wireframe: boolean) {
        this.set({ wireframe });
    }

    @Input() set wireframeLinewidth(wireframeLinewidth: number) {
        this.set({ wireframeLinewidth });
    }

    get materialType(): AnyConstructor<THREE.MeshDepthMaterial> {
        return THREE.MeshDepthMaterial;
    }

    protected override get subParameters(): Record<string, boolean> {
        return {
            ...super.subParameters,
            map: true,
            alphaMap: true,
            depthPacking: true,
            displacementMap: true,
            displacementScale: true,
            displacementBias: true,
            wireframe: true,
            wireframeLinewidth: true,
        };
    }
}

@NgModule({
    declarations: [NgtMeshDepthMaterial],
    exports: [NgtMeshDepthMaterial],
})
export class NgtMeshDepthMaterialModule {}
