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

    @Input() set bumpMap(bumpMap: THREE.Texture | null) {
        this.set({ bumpMap });
    }

    @Input() set bumpScale(bumpScale: number) {
        this.set({ bumpScale });
    }

    @Input() set normalMap(normalMap: THREE.Texture | null) {
        this.set({ normalMap });
    }

    @Input() set normalMapType(normalMapType: THREE.NormalMapTypes) {
        this.set({ normalMapType });
    }

    @Input() set normalScale(normalScale: THREE.Vector2) {
        this.set({ normalScale });
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

    @Input() set flatShading(flatShading: boolean) {
        this.set({ flatShading });
    }

    get materialType(): AnyConstructor<THREE.MeshNormalMaterial> {
        return THREE.MeshNormalMaterial;
    }

    protected override get optionFields(): Record<string, boolean> {
        return {
            ...super.optionFields,
            bumpMap: true,
            bumpScale: true,
            normalMap: true,
            normalMapType: true,
            normalScale: true,
            displacementMap: true,
            displacementScale: true,
            displacementBias: true,
            wireframe: true,
            wireframeLinewidth: true,
            flatShading: true,
        };
    }
}

@NgModule({
    declarations: [NgtMeshNormalMaterial],
    exports: [NgtMeshNormalMaterial],
})
export class NgtMeshNormalMaterialModule {}
