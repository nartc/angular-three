// GENERATED
import {
    AnyConstructor,
    NgtCommonMaterial,
    provideCommonMaterialRef,
    coerceBooleanProperty,
    BooleanInput,
} from '@angular-three/core';
import {
    ChangeDetectionStrategy,
    Component,
    NgModule,
    Input,
} from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-mesh-standard-material',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonMaterialRef(NgtMeshStandardMaterial)],
})
export class NgtMeshStandardMaterial<
    TStandardMaterialParameters extends THREE.MeshStandardMaterialParameters = THREE.MeshStandardMaterialParameters,
    TStandardMaterial extends THREE.MeshStandardMaterial = THREE.MeshStandardMaterial
> extends NgtCommonMaterial<
    THREE.MeshStandardMaterialParameters,
    THREE.MeshStandardMaterial
> {
    static ngAcceptInputType_parameters:
        | THREE.MeshStandardMaterialParameters
        | undefined;

    @Input() set color(color: THREE.ColorRepresentation) {
        this.set({ color });
    }

    @Input() set roughness(roughness: number) {
        this.set({ roughness });
    }

    @Input() set metalness(metalness: number) {
        this.set({ metalness });
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

    @Input() set roughnessMap(roughnessMap: THREE.Texture | null) {
        this.set({ roughnessMap });
    }

    @Input() set metalnessMap(metalnessMap: THREE.Texture | null) {
        this.set({ metalnessMap });
    }

    @Input() set alphaMap(alphaMap: THREE.Texture | null) {
        this.set({ alphaMap });
    }

    @Input() set envMap(envMap: THREE.Texture | null) {
        this.set({ envMap });
    }

    @Input() set envMapIntensity(envMapIntensity: number) {
        this.set({ envMapIntensity });
    }

    @Input() set wireframe(wireframe: BooleanInput) {
        this.set({ wireframe: coerceBooleanProperty(wireframe) });
    }

    @Input() set wireframeLinewidth(wireframeLinewidth: number) {
        this.set({ wireframeLinewidth });
    }

    @Input() set flatShading(flatShading: BooleanInput) {
        this.set({ flatShading: coerceBooleanProperty(flatShading) });
    }

    get materialType(): AnyConstructor<THREE.MeshStandardMaterial> {
        return THREE.MeshStandardMaterial;
    }

    protected override get optionFields(): Record<string, boolean> {
        return {
            ...super.optionFields,
            color: true,
            roughness: true,
            metalness: true,
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
            roughnessMap: true,
            metalnessMap: true,
            alphaMap: true,
            envMap: true,
            envMapIntensity: true,
            wireframe: true,
            wireframeLinewidth: true,
            flatShading: true,
        };
    }
}

@NgModule({
    declarations: [NgtMeshStandardMaterial],
    exports: [NgtMeshStandardMaterial],
})
export class NgtMeshStandardMaterialModule {}
