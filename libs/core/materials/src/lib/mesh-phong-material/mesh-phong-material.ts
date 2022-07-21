// GENERATED
import {
  AnyConstructor,
  NgtCommonMaterial,
  provideCommonMaterialRef,
  coerceBooleanProperty,
  BooleanInput,
  coerceNumberProperty,
  NumberInput,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule, Input } from '@angular/core';
import * as THREE from 'three/src/Three';

@Component({
  selector: 'ngt-mesh-phong-material',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonMaterialRef(NgtMeshPhongMaterial)],
})
export class NgtMeshPhongMaterial extends NgtCommonMaterial<
  THREE.MeshPhongMaterialParameters,
  THREE.MeshPhongMaterial
> {
  static ngAcceptInputType_parameters: THREE.MeshPhongMaterialParameters | undefined;

  @Input() set color(color: THREE.ColorRepresentation) {
    this.set({ color });
  }

  @Input() set specular(specular: THREE.ColorRepresentation) {
    this.set({ specular });
  }

  @Input() set shininess(shininess: NumberInput) {
    this.set({ shininess: coerceNumberProperty(shininess) });
  }

  @Input() override set opacity(opacity: NumberInput) {
    this.set({ opacity: coerceNumberProperty(opacity) });
  }

  @Input() set map(map: THREE.Texture | null) {
    this.set({ map });
  }

  @Input() set lightMap(lightMap: THREE.Texture | null) {
    this.set({ lightMap });
  }

  @Input() set lightMapIntensity(lightMapIntensity: NumberInput) {
    this.set({ lightMapIntensity: coerceNumberProperty(lightMapIntensity) });
  }

  @Input() set aoMap(aoMap: THREE.Texture | null) {
    this.set({ aoMap });
  }

  @Input() set aoMapIntensity(aoMapIntensity: NumberInput) {
    this.set({ aoMapIntensity: coerceNumberProperty(aoMapIntensity) });
  }

  @Input() set emissive(emissive: THREE.ColorRepresentation) {
    this.set({ emissive });
  }

  @Input() set emissiveIntensity(emissiveIntensity: NumberInput) {
    this.set({ emissiveIntensity: coerceNumberProperty(emissiveIntensity) });
  }

  @Input() set emissiveMap(emissiveMap: THREE.Texture | null) {
    this.set({ emissiveMap });
  }

  @Input() set bumpMap(bumpMap: THREE.Texture | null) {
    this.set({ bumpMap });
  }

  @Input() set bumpScale(bumpScale: NumberInput) {
    this.set({ bumpScale: coerceNumberProperty(bumpScale) });
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

  @Input() set displacementScale(displacementScale: NumberInput) {
    this.set({ displacementScale: coerceNumberProperty(displacementScale) });
  }

  @Input() set displacementBias(displacementBias: NumberInput) {
    this.set({ displacementBias: coerceNumberProperty(displacementBias) });
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

  @Input() set reflectivity(reflectivity: NumberInput) {
    this.set({ reflectivity: coerceNumberProperty(reflectivity) });
  }

  @Input() set refractionRatio(refractionRatio: NumberInput) {
    this.set({ refractionRatio: coerceNumberProperty(refractionRatio) });
  }

  @Input() set wireframe(wireframe: BooleanInput) {
    this.set({ wireframe: coerceBooleanProperty(wireframe) });
  }

  @Input() set wireframeLinewidth(wireframeLinewidth: NumberInput) {
    this.set({ wireframeLinewidth: coerceNumberProperty(wireframeLinewidth) });
  }

  @Input() set wireframeLinecap(wireframeLinecap: string) {
    this.set({ wireframeLinecap });
  }

  @Input() set wireframeLinejoin(wireframeLinejoin: string) {
    this.set({ wireframeLinejoin });
  }

  @Input() set fog(fog: BooleanInput) {
    this.set({ fog: coerceBooleanProperty(fog) });
  }

  @Input() set flatShading(flatShading: BooleanInput) {
    this.set({ flatShading: coerceBooleanProperty(flatShading) });
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
      fog: true,
      flatShading: true,
    };
  }
}

@NgModule({
  declarations: [NgtMeshPhongMaterial],
  exports: [NgtMeshPhongMaterial],
})
export class NgtMeshPhongMaterialModule {}
