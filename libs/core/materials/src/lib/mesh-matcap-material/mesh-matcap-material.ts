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
    selector: 'ngt-mesh-matcap-material',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonMaterialFactory<
            THREE.MeshMatcapMaterial,
            THREE.MeshMatcapMaterialParameters
        >(NgtMeshMatcapMaterial),
    ],
})
export class NgtMeshMatcapMaterial extends NgtCommonMaterial<
    THREE.MeshMatcapMaterialParameters,
    THREE.MeshMatcapMaterial
> {
    static ngAcceptInputType_parameters:
        | THREE.MeshMatcapMaterialParameters
        | undefined;

    @Input() set color(color: THREE.ColorRepresentation) {
        this.set({ color });
    }

    @Input() set matcap(matcap: THREE.Texture | null) {
        this.set({ matcap });
    }

    @Input() set map(map: THREE.Texture | null) {
        this.set({ map });
    }

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

    @Input() set alphaMap(alphaMap: THREE.Texture | null) {
        this.set({ alphaMap });
    }

    @Input() set flatShading(flatShading: boolean) {
        this.set({ flatShading });
    }

    get materialType(): AnyConstructor<THREE.MeshMatcapMaterial> {
        return THREE.MeshMatcapMaterial;
    }

    protected override get optionFields(): Record<string, boolean> {
        return {
            ...super.optionFields,
            color: true,
            matcap: true,
            map: true,
            bumpMap: true,
            bumpScale: true,
            normalMap: true,
            normalMapType: true,
            normalScale: true,
            displacementMap: true,
            displacementScale: true,
            displacementBias: true,
            alphaMap: true,
            flatShading: true,
        };
    }
}

@NgModule({
    declarations: [NgtMeshMatcapMaterial],
    exports: [NgtMeshMatcapMaterial],
})
export class NgtMeshMatcapMaterialModule {}
