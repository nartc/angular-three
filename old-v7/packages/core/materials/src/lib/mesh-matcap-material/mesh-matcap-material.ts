// GENERATED - AngularThree v7.0.0
import {
  NgtAnyConstructor,
  NgtCommonMaterial,
  provideNgtCommonMaterial,
  provideCommonMaterialRef,
  NgtObservableInput,
  coerceBoolean,
  NgtBooleanInput,
  coerceNumber,
  NgtNumberInput,
} from '@angular-three/core';
import { Component, Input } from '@angular/core';
import { isObservable, map } from 'rxjs';
import * as THREE from 'three';

@Component({
  selector: 'ngt-mesh-matcap-material',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonMaterial(NgtMeshMatcapMaterial), provideCommonMaterialRef(NgtMeshMatcapMaterial)],
})
export class NgtMeshMatcapMaterial extends NgtCommonMaterial<THREE.MeshMatcapMaterial> {
  @Input() set color(color: NgtObservableInput<THREE.ColorRepresentation>) {
    this.set({ color });
  }

  @Input() set matcap(matcap: NgtObservableInput<THREE.Texture | null>) {
    this.set({ matcap });
  }

  @Input() set map(map: NgtObservableInput<THREE.Texture | null>) {
    this.set({ map });
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

  @Input() set fog(fog: NgtObservableInput<NgtBooleanInput>) {
    this.set({ fog: isObservable(fog) ? fog.pipe(map(coerceBoolean)) : coerceBoolean(fog) });
  }

  @Input() set flatShading(flatShading: NgtObservableInput<NgtBooleanInput>) {
    this.set({
      flatShading: isObservable(flatShading) ? flatShading.pipe(map(coerceBoolean)) : coerceBoolean(flatShading),
    });
  }

  override get materialType(): NgtAnyConstructor<THREE.MeshMatcapMaterial> {
    return THREE.MeshMatcapMaterial;
  }

  override get optionsFields() {
    return [
      ...super.optionsFields,
      'color',
      'matcap',
      'map',
      'bumpMap',
      'bumpScale',
      'normalMap',
      'normalMapType',
      'normalScale',
      'displacementMap',
      'displacementScale',
      'displacementBias',
      'alphaMap',
      'fog',
      'flatShading',
    ];
  }
}
