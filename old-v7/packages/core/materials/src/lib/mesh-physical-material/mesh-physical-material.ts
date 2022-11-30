// GENERATED - AngularThree v7.0.0
import {
  coerceNumber,
  NgtAnyConstructor,
  NgtNumberInput,
  NgtObservableInput,
  provideCommonMaterialRef,
  provideNgtCommonMaterial,
} from '@angular-three/core';
import { Component, Input } from '@angular/core';
import { isObservable, map } from 'rxjs';
import * as THREE from 'three';
import { NgtMeshStandardMaterial } from '../mesh-standard-material/mesh-standard-material';
@Component({
  selector: 'ngt-mesh-physical-material',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonMaterial(NgtMeshPhysicalMaterial), provideCommonMaterialRef(NgtMeshPhysicalMaterial)],
})
export class NgtMeshPhysicalMaterial extends NgtMeshStandardMaterial<THREE.MeshPhysicalMaterial> {
  @Input() set clearcoat(clearcoat: NgtObservableInput<NgtNumberInput>) {
    this.set({ clearcoat: isObservable(clearcoat) ? clearcoat.pipe(map(coerceNumber)) : coerceNumber(clearcoat) });
  }

  @Input() set clearcoatMap(clearcoatMap: NgtObservableInput<THREE.Texture | null>) {
    this.set({ clearcoatMap });
  }

  @Input() set clearcoatRoughness(clearcoatRoughness: NgtObservableInput<NgtNumberInput>) {
    this.set({
      clearcoatRoughness: isObservable(clearcoatRoughness)
        ? clearcoatRoughness.pipe(map(coerceNumber))
        : coerceNumber(clearcoatRoughness),
    });
  }

  @Input() set clearcoatRoughnessMap(clearcoatRoughnessMap: NgtObservableInput<THREE.Texture | null>) {
    this.set({ clearcoatRoughnessMap });
  }

  @Input() set clearcoatNormalScale(clearcoatNormalScale: NgtObservableInput<THREE.Vector2>) {
    this.set({ clearcoatNormalScale });
  }

  @Input() set clearcoatNormalMap(clearcoatNormalMap: NgtObservableInput<THREE.Texture | null>) {
    this.set({ clearcoatNormalMap });
  }

  @Input() set reflectivity(reflectivity: NgtObservableInput<NgtNumberInput>) {
    this.set({
      reflectivity: isObservable(reflectivity) ? reflectivity.pipe(map(coerceNumber)) : coerceNumber(reflectivity),
    });
  }

  @Input() set ior(ior: NgtObservableInput<NgtNumberInput>) {
    this.set({ ior: isObservable(ior) ? ior.pipe(map(coerceNumber)) : coerceNumber(ior) });
  }

  @Input() set sheen(sheen: NgtObservableInput<NgtNumberInput>) {
    this.set({ sheen: isObservable(sheen) ? sheen.pipe(map(coerceNumber)) : coerceNumber(sheen) });
  }

  @Input() set sheenColor(sheenColor: NgtObservableInput<THREE.Color>) {
    this.set({ sheenColor });
  }

  @Input() set sheenRoughness(sheenRoughness: NgtObservableInput<NgtNumberInput>) {
    this.set({
      sheenRoughness: isObservable(sheenRoughness)
        ? sheenRoughness.pipe(map(coerceNumber))
        : coerceNumber(sheenRoughness),
    });
  }

  @Input() set transmission(transmission: NgtObservableInput<NgtNumberInput>) {
    this.set({
      transmission: isObservable(transmission) ? transmission.pipe(map(coerceNumber)) : coerceNumber(transmission),
    });
  }

  @Input() set transmissionMap(transmissionMap: NgtObservableInput<THREE.Texture | null>) {
    this.set({ transmissionMap });
  }

  @Input() set attenuationDistance(attenuationDistance: NgtObservableInput<NgtNumberInput>) {
    this.set({
      attenuationDistance: isObservable(attenuationDistance)
        ? attenuationDistance.pipe(map(coerceNumber))
        : coerceNumber(attenuationDistance),
    });
  }

  @Input() set attenuationColor(attenuationColor: NgtObservableInput<THREE.Color>) {
    this.set({ attenuationColor });
  }

  @Input() set specularIntensity(specularIntensity: NgtObservableInput<NgtNumberInput>) {
    this.set({
      specularIntensity: isObservable(specularIntensity)
        ? specularIntensity.pipe(map(coerceNumber))
        : coerceNumber(specularIntensity),
    });
  }

  @Input() set specularColor(specularColor: NgtObservableInput<THREE.Color>) {
    this.set({ specularColor });
  }

  @Input() set specularIntensityMap(specularIntensityMap: NgtObservableInput<THREE.Texture | null>) {
    this.set({ specularIntensityMap });
  }

  @Input() set specularColorMap(specularColorMap: NgtObservableInput<THREE.Texture | null>) {
    this.set({ specularColorMap });
  }

  override get materialType(): NgtAnyConstructor<THREE.MeshPhysicalMaterial> {
    return THREE.MeshPhysicalMaterial;
  }

  override get optionsFields() {
    return [
      ...super.optionsFields,
      'clearcoat',
      'clearcoatMap',
      'clearcoatRoughness',
      'clearcoatRoughnessMap',
      'clearcoatNormalScale',
      'clearcoatNormalMap',
      'reflectivity',
      'ior',
      'sheen',
      'sheenColor',
      'sheenRoughness',
      'transmission',
      'transmissionMap',
      'attenuationDistance',
      'attenuationColor',
      'specularIntensity',
      'specularColor',
      'specularIntensityMap',
      'specularColorMap',
    ];
  }
}
