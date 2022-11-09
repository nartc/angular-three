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
  selector: 'ngt-mesh-standard-material',
  standalone: true,
  template: '<ng-content></ng-content>',

  providers: [
    provideNgtCommonMaterial(NgtMeshStandardMaterial),
    provideCommonMaterialRef(NgtMeshStandardMaterial),
  ],
})
export class NgtMeshStandardMaterial<
  TStandardMaterial extends THREE.MeshStandardMaterial = THREE.MeshStandardMaterial
> extends NgtCommonMaterial<TStandardMaterial> {
  @Input() set color(color: THREE.ColorRepresentation) {
    this.set({ color });
  }

  @Input() set roughness(roughness: NumberInput) {
    this.set({ roughness: coerceNumberProperty(roughness) });
  }

  @Input() set metalness(metalness: NumberInput) {
    this.set({ metalness: coerceNumberProperty(metalness) });
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

  @Input() set envMapIntensity(envMapIntensity: NumberInput) {
    this.set({ envMapIntensity: coerceNumberProperty(envMapIntensity) });
  }

  @Input() set wireframe(wireframe: BooleanInput) {
    this.set({ wireframe: coerceBooleanProperty(wireframe) });
  }

  @Input() set wireframeLinewidth(wireframeLinewidth: NumberInput) {
    this.set({ wireframeLinewidth: coerceNumberProperty(wireframeLinewidth) });
  }

  @Input() set fog(fog: BooleanInput) {
    this.set({ fog: coerceBooleanProperty(fog) });
  }

  @Input() set flatShading(flatShading: BooleanInput) {
    this.set({ flatShading: coerceBooleanProperty(flatShading) });
  }

  override get materialType(): AnyConstructor<TStandardMaterial> {
    return THREE.MeshStandardMaterial as AnyConstructor<TStandardMaterial>;
  }

  override get optionsFields(): Record<string, boolean> {
    return {
      ...super.optionsFields,
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
      fog: true,
      flatShading: true,
    };
  }
}
