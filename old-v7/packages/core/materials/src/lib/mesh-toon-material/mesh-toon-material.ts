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
  selector: 'ngt-mesh-toon-material',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonMaterial(NgtMeshToonMaterial), provideCommonMaterialRef(NgtMeshToonMaterial)],
})
export class NgtMeshToonMaterial extends NgtCommonMaterial<THREE.MeshToonMaterial> {
  @Input() set color(color: NgtObservableInput<THREE.ColorRepresentation>) {
    this.set({ color });
  }

  @Input() override set opacity(opacity: NgtObservableInput<NgtNumberInput>) {
    this.set({ opacity: isObservable(opacity) ? opacity.pipe(map(coerceNumber)) : coerceNumber(opacity) });
  }

  @Input() set gradientMap(gradientMap: NgtObservableInput<THREE.Texture | null>) {
    this.set({ gradientMap });
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

  @Input() set bumpMap(bumpMap: NgtObservableInput<THREE.Texture | null>) {
    this.set({ bumpMap });
  }

  @Input() set bumpScale(bumpScale: NgtObservableInput<NgtNumberInput>) {
    this.set({ bumpScale: isObservable(bumpScale) ? bumpScale.pipe(map(coerceNumber)) : coerceNumber(bumpScale) });
  }

  @Input() set normalMap(normalMap: NgtObservableInput<THREE.Texture | null>) {
    this.set({ normalMap });
  }

  @Input() set normalMapType(normalMapType: NgtObservableInput<THREE.NormalMapTypes>) {
    this.set({ normalMapType });
  }

  @Input() set normalScale(normalScale: NgtObservableInput<THREE.Vector2>) {
    this.set({ normalScale });
  }

  @Input() set displacementMap(displacementMap: NgtObservableInput<THREE.Texture | null>) {
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

  @Input() set alphaMap(alphaMap: NgtObservableInput<THREE.Texture | null>) {
    this.set({ alphaMap });
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

  override get materialType(): NgtAnyConstructor<THREE.MeshToonMaterial> {
    return THREE.MeshToonMaterial;
  }

  override get optionsFields() {
    return [
      ...super.optionsFields,
      'color',
      'opacity',
      'gradientMap',
      'map',
      'lightMap',
      'lightMapIntensity',
      'aoMap',
      'aoMapIntensity',
      'emissive',
      'emissiveIntensity',
      'emissiveMap',
      'bumpMap',
      'bumpScale',
      'normalMap',
      'normalMapType',
      'normalScale',
      'displacementMap',
      'displacementScale',
      'displacementBias',
      'alphaMap',
      'wireframe',
      'wireframeLinewidth',
      'wireframeLinecap',
      'wireframeLinejoin',
      'fog',
    ];
  }
}
