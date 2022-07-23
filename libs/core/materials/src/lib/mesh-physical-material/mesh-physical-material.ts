// GENERATED
import {
  AnyConstructor,
  NgtCommonMaterial,
  provideNgtCommonMaterial,
  provideCommonMaterialRef,
  coerceNumberProperty,
  NumberInput,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule, Input } from '@angular/core';
import * as THREE from 'three';
import { NgtMeshStandardMaterial } from '../mesh-standard-material/mesh-standard-material';

@Component({
  selector: 'ngt-mesh-physical-material',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgtCommonMaterial(NgtMeshPhysicalMaterial), provideCommonMaterialRef(NgtMeshPhysicalMaterial)],
})
export class NgtMeshPhysicalMaterial extends NgtMeshStandardMaterial<
  THREE.MeshPhysicalMaterialParameters,
  THREE.MeshPhysicalMaterial
> {
  static override ngAcceptInputType_parameters: THREE.MeshPhysicalMaterialParameters | undefined;

  @Input() set clearcoat(clearcoat: NumberInput) {
    this.set({ clearcoat: coerceNumberProperty(clearcoat) });
  }

  @Input() set clearcoatMap(clearcoatMap: THREE.Texture | null) {
    this.set({ clearcoatMap });
  }

  @Input() set clearcoatRoughness(clearcoatRoughness: NumberInput) {
    this.set({ clearcoatRoughness: coerceNumberProperty(clearcoatRoughness) });
  }

  @Input() set clearcoatRoughnessMap(clearcoatRoughnessMap: THREE.Texture | null) {
    this.set({ clearcoatRoughnessMap });
  }

  @Input() set clearcoatNormalScale(clearcoatNormalScale: THREE.Vector2) {
    this.set({ clearcoatNormalScale });
  }

  @Input() set clearcoatNormalMap(clearcoatNormalMap: THREE.Texture | null) {
    this.set({ clearcoatNormalMap });
  }

  @Input() set reflectivity(reflectivity: NumberInput) {
    this.set({ reflectivity: coerceNumberProperty(reflectivity) });
  }

  @Input() set ior(ior: NumberInput) {
    this.set({ ior: coerceNumberProperty(ior) });
  }

  @Input() set sheen(sheen: NumberInput) {
    this.set({ sheen: coerceNumberProperty(sheen) });
  }

  @Input() set sheenColor(sheenColor: THREE.Color) {
    this.set({ sheenColor });
  }

  @Input() set sheenRoughness(sheenRoughness: NumberInput) {
    this.set({ sheenRoughness: coerceNumberProperty(sheenRoughness) });
  }

  @Input() set transmission(transmission: NumberInput) {
    this.set({ transmission: coerceNumberProperty(transmission) });
  }

  @Input() set transmissionMap(transmissionMap: THREE.Texture | null) {
    this.set({ transmissionMap });
  }

  @Input() set attenuationDistance(attenuationDistance: NumberInput) {
    this.set({ attenuationDistance: coerceNumberProperty(attenuationDistance) });
  }

  @Input() set attenuationColor(attenuationColor: THREE.Color) {
    this.set({ attenuationColor });
  }

  @Input() set specularIntensity(specularIntensity: NumberInput) {
    this.set({ specularIntensity: coerceNumberProperty(specularIntensity) });
  }

  @Input() set specularColor(specularColor: THREE.Color) {
    this.set({ specularColor });
  }

  @Input() set specularIntensityMap(specularIntensityMap: THREE.Texture | null) {
    this.set({ specularIntensityMap });
  }

  @Input() set specularColorMap(specularColorMap: THREE.Texture | null) {
    this.set({ specularColorMap });
  }

  override get materialType(): AnyConstructor<THREE.MeshPhysicalMaterial> {
    return THREE.MeshPhysicalMaterial;
  }

  protected override get optionFields(): Record<string, boolean> {
    return {
      ...super.optionFields,
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
  imports: [NgtMeshPhysicalMaterial],
  exports: [NgtMeshPhysicalMaterial],
})
export class NgtMeshPhysicalMaterialModule {}
