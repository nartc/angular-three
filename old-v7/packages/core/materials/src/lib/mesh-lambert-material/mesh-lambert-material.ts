// GENERATED - AngularThree v7.0.0
import {
  coerceBoolean,
  coerceNumber,
  NgtAnyConstructor,
  NgtBooleanInput,
  NgtCommonMaterial,
  NgtNumberInput,
  NgtObservableInput,
  provideCommonMaterialRef,
  provideNgtCommonMaterial,
} from '@angular-three/core';
import { Component, Input } from '@angular/core';
import { isObservable, map } from 'rxjs';
import * as THREE from 'three';

@Component({
  selector: 'ngt-mesh-lambert-material',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonMaterial(NgtMeshLambertMaterial), provideCommonMaterialRef(NgtMeshLambertMaterial)],
})
export class NgtMeshLambertMaterial extends NgtCommonMaterial<THREE.MeshLambertMaterial> {
  @Input() set bumpMap(bumpMap: NgtObservableInput<THREE.Texture>) {
    this.set({ bumpMap });
  }

  @Input() set bumpScale(bumpScale: NgtObservableInput<NgtNumberInput>) {
    this.set({ bumpScale: isObservable(bumpScale) ? bumpScale.pipe(map(coerceNumber)) : coerceNumber(bumpScale) });
  }

  @Input() set color(color: NgtObservableInput<THREE.ColorRepresentation>) {
    this.set({ color });
  }

  @Input() set displacementMap(displacementMap: NgtObservableInput<THREE.Texture>) {
    this.set({ displacementMap });
  }

  @Input() set displacementScale(displacementScale: NgtObservableInput<NgtNumberInput>) {
    this.set({
      displacementScale: isObservable(displacementScale)
        ? displacementScale.pipe(map(coerceNumber))
        : coerceNumber(displacementScale),
    });
  }

  @Input() set displacementBias(displacementBias: NgtObservableInput<NgtNumberInput>) {
    this.set({
      displacementBias: isObservable(displacementBias)
        ? displacementBias.pipe(map(coerceNumber))
        : coerceNumber(displacementBias),
    });
  }

  @Input() set emissive(emissive: NgtObservableInput<THREE.ColorRepresentation>) {
    this.set({ emissive });
  }

  @Input() set emissiveIntensity(emissiveIntensity: NgtObservableInput<NgtNumberInput>) {
    this.set({
      emissiveIntensity: isObservable(emissiveIntensity)
        ? emissiveIntensity.pipe(map(coerceNumber))
        : coerceNumber(emissiveIntensity),
    });
  }

  @Input() set emissiveMap(emissiveMap: NgtObservableInput<THREE.Texture | null>) {
    this.set({ emissiveMap });
  }

  @Input() set flatShading(flatShading: NgtObservableInput<NgtBooleanInput>) {
    this.set({
      flatShading: isObservable(flatShading) ? flatShading.pipe(map(coerceBoolean)) : coerceBoolean(flatShading),
    });
  }

  @Input() set map(map: NgtObservableInput<THREE.Texture | null>) {
    this.set({ map });
  }

  @Input() set lightMap(lightMap: NgtObservableInput<THREE.Texture | null>) {
    this.set({ lightMap });
  }

  @Input() set lightMapIntensity(lightMapIntensity: NgtObservableInput<NgtNumberInput>) {
    this.set({
      lightMapIntensity: isObservable(lightMapIntensity)
        ? lightMapIntensity.pipe(map(coerceNumber))
        : coerceNumber(lightMapIntensity),
    });
  }

  @Input() set normalMap(normalMap: NgtObservableInput<THREE.Texture>) {
    this.set({ normalMap });
  }

  @Input() set normalScale(normalScale: NgtObservableInput<THREE.Vector2>) {
    this.set({ normalScale });
  }

  @Input() set aoMap(aoMap: NgtObservableInput<THREE.Texture | null>) {
    this.set({ aoMap });
  }

  @Input() set aoMapIntensity(aoMapIntensity: NgtObservableInput<NgtNumberInput>) {
    this.set({
      aoMapIntensity: isObservable(aoMapIntensity)
        ? aoMapIntensity.pipe(map(coerceNumber))
        : coerceNumber(aoMapIntensity),
    });
  }

  @Input() set specularMap(specularMap: NgtObservableInput<THREE.Texture | null>) {
    this.set({ specularMap });
  }

  @Input() set alphaMap(alphaMap: NgtObservableInput<THREE.Texture | null>) {
    this.set({ alphaMap });
  }

  @Input() set envMap(envMap: NgtObservableInput<THREE.Texture | null>) {
    this.set({ envMap });
  }

  @Input() set combine(combine: NgtObservableInput<THREE.Combine>) {
    this.set({ combine });
  }

  @Input() set reflectivity(reflectivity: NgtObservableInput<NgtNumberInput>) {
    this.set({
      reflectivity: isObservable(reflectivity) ? reflectivity.pipe(map(coerceNumber)) : coerceNumber(reflectivity),
    });
  }

  @Input() set refractionRatio(refractionRatio: NgtObservableInput<NgtNumberInput>) {
    this.set({
      refractionRatio: isObservable(refractionRatio)
        ? refractionRatio.pipe(map(coerceNumber))
        : coerceNumber(refractionRatio),
    });
  }

  @Input() set wireframe(wireframe: NgtObservableInput<NgtBooleanInput>) {
    this.set({ wireframe: isObservable(wireframe) ? wireframe.pipe(map(coerceBoolean)) : coerceBoolean(wireframe) });
  }

  @Input() set wireframeLinewidth(wireframeLinewidth: NgtObservableInput<NgtNumberInput>) {
    this.set({
      wireframeLinewidth: isObservable(wireframeLinewidth)
        ? wireframeLinewidth.pipe(map(coerceNumber))
        : coerceNumber(wireframeLinewidth),
    });
  }

  @Input() set wireframeLinecap(wireframeLinecap: NgtObservableInput<string>) {
    this.set({ wireframeLinecap });
  }

  @Input() set wireframeLinejoin(wireframeLinejoin: NgtObservableInput<string>) {
    this.set({ wireframeLinejoin });
  }

  @Input() set fog(fog: NgtObservableInput<NgtBooleanInput>) {
    this.set({ fog: isObservable(fog) ? fog.pipe(map(coerceBoolean)) : coerceBoolean(fog) });
  }

  override get materialType(): NgtAnyConstructor<THREE.MeshLambertMaterial> {
    return THREE.MeshLambertMaterial;
  }

  override get optionsFields() {
    return [
      ...super.optionsFields,
      'bumpMap',
      'bumpScale',
      'color',
      'displacementMap',
      'displacementScale',
      'displacementBias',
      'emissive',
      'emissiveIntensity',
      'emissiveMap',
      'flatShading',
      'map',
      'lightMap',
      'lightMapIntensity',
      'normalMap',
      'normalScale',
      'aoMap',
      'aoMapIntensity',
      'specularMap',
      'alphaMap',
      'envMap',
      'combine',
      'reflectivity',
      'refractionRatio',
      'wireframe',
      'wireframeLinewidth',
      'wireframeLinecap',
      'wireframeLinejoin',
      'fog',
    ];
  }
}
