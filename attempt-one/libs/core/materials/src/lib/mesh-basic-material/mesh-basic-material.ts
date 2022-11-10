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
  selector: 'ngt-mesh-basic-material',
  standalone: true,
  template: '<ng-content></ng-content>',

  providers: [
    provideNgtCommonMaterial(NgtMeshBasicMaterial),
    provideCommonMaterialRef(NgtMeshBasicMaterial),
  ],
})
export class NgtMeshBasicMaterial extends NgtCommonMaterial<THREE.MeshBasicMaterial> {
  @Input() set color(color: THREE.ColorRepresentation) {
    this.set({ color });
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

  @Input() set specularMap(specularMap: THREE.Texture | null) {
    this.set({ specularMap });
  }

  @Input() set alphaMap(alphaMap: THREE.Texture | null) {
    this.set({ alphaMap });
  }

  @Input() set fog(fog: BooleanInput) {
    this.set({ fog: coerceBooleanProperty(fog) });
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

  override get materialType(): AnyConstructor<THREE.MeshBasicMaterial> {
    return THREE.MeshBasicMaterial;
  }

  override get optionsFields(): Record<string, boolean> {
    return {
      ...super.optionsFields,
      color: true,
      opacity: true,
      map: true,
      lightMap: true,
      lightMapIntensity: true,
      aoMap: true,
      aoMapIntensity: true,
      specularMap: true,
      alphaMap: true,
      fog: true,
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
