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

    @Input() set color(color: THREE.ColorRepresentation) {
        this.set({ color });
    }

    @Input() set specular(specular: THREE.ColorRepresentation) {
        this.set({ specular });
    }

    @Input() set shininess(shininess: number) {
        this.set({ shininess });
    }

    @Input() override set opacity(opacity: number) {
        this.set({ opacity });
    }

    @Input() set map(map: THREE.Texture | null) {
        this.set({ map });
    }

    @Input() set lightMap(lightMap: THREE.Texture | null) {
        this.set({ lightMap });
    }

    @Input() set lightMapIntensity(lightMapIntensity: number) {
        this.set({ lightMapIntensity });
    }

    @Input() set aoMap(aoMap: THREE.Texture | null) {
        this.set({ aoMap });
    }

    @Input() set aoMapIntensity(aoMapIntensity: number) {
        this.set({ aoMapIntensity });
    }

    @Input() set emissive(emissive: THREE.ColorRepresentation) {
        this.set({ emissive });
    }

    @Input() set emissiveIntensity(emissiveIntensity: number) {
        this.set({ emissiveIntensity });
    }

    @Input() set emissiveMap(emissiveMap: THREE.Texture | null) {
        this.set({ emissiveMap });
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

    @Input() set specularMap(specularMap: THREE.Texture | null) {
        this.set({ specularMap });
    }

    @Input() set alphaMap(alphaMap: THREE.Texture | null) {
        this.set({ alphaMap });
    }

    @Input() set envMap(envMap: THREE.Texture | null) {
        this.set({ envMap });
    }

    @Input() set combine(combine: THREE.Combine) {
        this.set({ combine });
    }

    @Input() set reflectivity(reflectivity: number) {
        this.set({ reflectivity });
    }

    @Input() set refractionRatio(refractionRatio: number) {
        this.set({ refractionRatio });
    }

    @Input() set wireframe(wireframe: boolean) {
        this.set({ wireframe });
    }

    @Input() set wireframeLinewidth(wireframeLinewidth: number) {
        this.set({ wireframeLinewidth });
    }

    @Input() set wireframeLinecap(wireframeLinecap: string) {
        this.set({ wireframeLinecap });
    }

    @Input() set wireframeLinejoin(wireframeLinejoin: string) {
        this.set({ wireframeLinejoin });
    }

    @Input() set flatShading(flatShading: boolean) {
        this.set({ flatShading });
    }

    get materialType(): AnyConstructor<THREE.MeshPhongMaterial> {
        return THREE.MeshPhongMaterial;
    }

    protected override get optionFields(): Record<string, boolean> {
        return {
            ...super.optionFields,
            color: true,
            specular: true,
            shininess: true,
            opacity: true,
            map: true,
            lightMap: true,
            lightMapIntensity: true,
            aoMap: true,
            aoMapIntensity: true,
            emissive: true,
            emissiveIntensity: true,
            emissiveMap: true,
            bumpMap: true,
            bumpScale: true,
            normalMap: true,
            normalMapType: true,
            normalScale: true,
            displacementMap: true,
            displacementScale: true,
            displacementBias: true,
            specularMap: true,
            alphaMap: true,
            envMap: true,
            combine: true,
            reflectivity: true,
            refractionRatio: true,
            wireframe: true,
            wireframeLinewidth: true,
            wireframeLinecap: true,
            wireframeLinejoin: true,
            flatShading: true,
        };
    }
}

@NgModule({
    declarations: [NgtMeshPhongMaterial],
    exports: [NgtMeshPhongMaterial],
})
export class NgtMeshPhongMaterialModule {}
