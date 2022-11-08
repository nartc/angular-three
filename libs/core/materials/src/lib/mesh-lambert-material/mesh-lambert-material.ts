// GENERATED - AngularThree v7.0.0
import {
  AnyConstructor,
  NgtCommonMaterial,
  provideNgtCommonMaterial,
  provideCommonMaterialRef,
  coerceBooleanProperty,
  BooleanInput,
  coerceNumberProperty,
  NumberInput,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-mesh-lambert-material',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideNgtCommonMaterial(NgtMeshLambertMaterial),
    provideCommonMaterialRef(NgtMeshLambertMaterial),
  ],
})
export class NgtMeshLambertMaterial extends NgtCommonMaterial<THREE.MeshLambertMaterial> {
  @Input() set bumpMap(bumpMap: THREE.Texture) {
    this.set({ bumpMap });
  }

  @Input() set bumpScale(bumpScale: NumberInput) {
    this.set({ bumpScale: coerceNumberProperty(bumpScale) });
  }

  @Input() set color(color: THREE.ColorRepresentation) {
    this.set({ color });
  }

  @Input() set displacementMap(displacementMap: THREE.Texture) {
    this.set({ displacementMap });
  }

  @Input() set displacementScale(displacementScale: NumberInput) {
    this.set({ displacementScale: coerceNumberProperty(displacementScale) });
  }

  @Input() set displacementBias(displacementBias: NumberInput) {
    this.set({ displacementBias: coerceNumberProperty(displacementBias) });
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

  @Input() set flatShading(flatShading: BooleanInput) {
    this.set({ flatShading: coerceBooleanProperty(flatShading) });
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

  @Input() set normalMap(normalMap: THREE.Texture) {
    this.set({ normalMap });
  }

  @Input() set normalScale(normalScale: THREE.Vector2) {
    this.set({ normalScale });
  }

  @Input() set aoMap(aoMap: THREE.Texture | null) {
    this.set({ aoMap });
  }

  @Input() set aoMapIntensity(aoMapIntensity: NumberInput) {
    this.set({ aoMapIntensity: coerceNumberProperty(aoMapIntensity) });
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

  override get materialType(): AnyConstructor<THREE.MeshLambertMaterial> {
    return THREE.MeshLambertMaterial;
  }

  override get optionsFields(): Record<string, boolean> {
    return {
      ...super.optionsFields,
      bumpMap: true,
      bumpScale: true,
      color: true,
      displacementMap: true,
      displacementScale: true,
      displacementBias: true,
      emissive: true,
      emissiveIntensity: true,
      emissiveMap: true,
      flatShading: true,
      map: true,
      lightMap: true,
      lightMapIntensity: true,
      normalMap: true,
      normalScale: true,
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
      fog: true,
    };
  }
}
