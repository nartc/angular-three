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
    selector: 'ngt-mesh-lambert-material',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonMaterialFactory<
            THREE.MeshLambertMaterial,
            THREE.MeshLambertMaterialParameters
        >(NgtMeshLambertMaterial),
    ],
})
export class NgtMeshLambertMaterial extends NgtCommonMaterial<
    THREE.MeshLambertMaterialParameters,
    THREE.MeshLambertMaterial
> {
    static ngAcceptInputType_parameters:
        | THREE.MeshLambertMaterialParameters
        | undefined;

    @Input() set color(color: THREE.ColorRepresentation) {
        this.set({ color });
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

    get materialType(): AnyConstructor<THREE.MeshLambertMaterial> {
        return THREE.MeshLambertMaterial;
    }

    protected override get optionFields(): Record<string, boolean> {
        return {
            ...super.optionFields,
            color: true,
            emissive: true,
            emissiveIntensity: true,
            emissiveMap: true,
            map: true,
            lightMap: true,
            lightMapIntensity: true,
            aoMap: true,
            aoMapIntensity: true,
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
        };
    }
}

@NgModule({
    declarations: [NgtMeshLambertMaterial],
    exports: [NgtMeshLambertMaterial],
})
export class NgtMeshLambertMaterialModule {}
