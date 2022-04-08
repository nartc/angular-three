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
import { NgtMeshStandardMaterial } from '../mesh-standard-material/mesh-standard-material';

@Component({
    selector: 'ngt-mesh-physical-material',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonMaterialFactory<
            THREE.MeshPhysicalMaterial,
            THREE.MeshPhysicalMaterialParameters
        >(
            NgtMeshPhysicalMaterial as unknown as AnyConstructor<
                NgtCommonMaterial<
                    THREE.MeshPhysicalMaterialParameters,
                    THREE.MeshPhysicalMaterial
                >
            >
        ),
    ],
})
export class NgtMeshPhysicalMaterial extends NgtMeshStandardMaterial<
    THREE.MeshPhysicalMaterialParameters,
    THREE.MeshPhysicalMaterial
> {
    static override ngAcceptInputType_parameters:
        | THREE.MeshPhysicalMaterialParameters
        | undefined;

    @Input() set clearcoat(clearcoat: number) {
        this.set({ clearcoat });
    }

    @Input() set clearcoatMap(clearcoatMap: THREE.Texture | null) {
        this.set({ clearcoatMap });
    }

    @Input() set clearcoatRoughness(clearcoatRoughness: number) {
        this.set({ clearcoatRoughness });
    }

    @Input() set clearcoatRoughnessMap(
        clearcoatRoughnessMap: THREE.Texture | null
    ) {
        this.set({ clearcoatRoughnessMap });
    }

    @Input() set clearcoatNormalScale(clearcoatNormalScale: THREE.Vector2) {
        this.set({ clearcoatNormalScale });
    }

    @Input() set clearcoatNormalMap(clearcoatNormalMap: THREE.Texture | null) {
        this.set({ clearcoatNormalMap });
    }

    @Input() set reflectivity(reflectivity: number) {
        this.set({ reflectivity });
    }

    @Input() set ior(ior: number) {
        this.set({ ior });
    }

    @Input() set sheen(sheen: number) {
        this.set({ sheen });
    }

    @Input() set sheenColor(sheenColor: THREE.Color) {
        this.set({ sheenColor });
    }

    @Input() set sheenRoughness(sheenRoughness: number) {
        this.set({ sheenRoughness });
    }

    @Input() set transmission(transmission: number) {
        this.set({ transmission });
    }

    @Input() set transmissionMap(transmissionMap: THREE.Texture | null) {
        this.set({ transmissionMap });
    }

    @Input() set attenuationDistance(attenuationDistance: number) {
        this.set({ attenuationDistance });
    }

    @Input() set attenuationColor(attenuationColor: THREE.Color) {
        this.set({ attenuationColor });
    }

    @Input() set specularIntensity(specularIntensity: number) {
        this.set({ specularIntensity });
    }

    @Input() set specularColor(specularColor: THREE.Color) {
        this.set({ specularColor });
    }

    @Input() set specularIntensityMap(
        specularIntensityMap: THREE.Texture | null
    ) {
        this.set({ specularIntensityMap });
    }

    @Input() set specularColorMap(specularColorMap: THREE.Texture | null) {
        this.set({ specularColorMap });
    }

    override get materialType(): AnyConstructor<THREE.MeshPhysicalMaterial> {
        return THREE.MeshPhysicalMaterial;
    }

    protected override get subParameters(): Record<string, boolean> {
        return {
            ...super.subParameters,
            clearcoat: true,
            clearcoatMap: true,
            clearcoatRoughness: true,
            clearcoatRoughnessMap: true,
            clearcoatNormalScale: true,
            clearcoatNormalMap: true,
            reflectivity: true,
            ior: true,
            sheen: true,
            sheenColor: true,
            sheenRoughness: true,
            transmission: true,
            transmissionMap: true,
            attenuationDistance: true,
            attenuationColor: true,
            specularIntensity: true,
            specularColor: true,
            specularIntensityMap: true,
            specularColorMap: true,
        };
    }
}

@NgModule({
    declarations: [NgtMeshPhysicalMaterial],
    exports: [NgtMeshPhysicalMaterial],
})
export class NgtMeshPhysicalMaterialModule {}
