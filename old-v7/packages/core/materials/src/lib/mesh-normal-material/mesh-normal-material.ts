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
  selector: 'ngt-mesh-normal-material',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonMaterial(NgtMeshNormalMaterial), provideCommonMaterialRef(NgtMeshNormalMaterial)],
})
export class NgtMeshNormalMaterial extends NgtCommonMaterial<THREE.MeshNormalMaterial> {
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

  @Input() set flatShading(flatShading: NgtObservableInput<NgtBooleanInput>) {
    this.set({
      flatShading: isObservable(flatShading) ? flatShading.pipe(map(coerceBoolean)) : coerceBoolean(flatShading),
    });
  }

  override get materialType(): NgtAnyConstructor<THREE.MeshNormalMaterial> {
    return THREE.MeshNormalMaterial;
  }

  override get optionsFields() {
    return [
      ...super.optionsFields,
      'bumpMap',
      'bumpScale',
      'normalMap',
      'normalMapType',
      'normalScale',
      'displacementMap',
      'displacementScale',
      'displacementBias',
      'wireframe',
      'wireframeLinewidth',
      'flatShading',
    ];
  }
}
