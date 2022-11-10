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
  selector: 'ngt-mesh-depth-material',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonMaterial(NgtMeshDepthMaterial), provideCommonMaterialRef(NgtMeshDepthMaterial)],
})
export class NgtMeshDepthMaterial extends NgtCommonMaterial<THREE.MeshDepthMaterial> {
  @Input() set map(map: NgtObservableInput<THREE.Texture | null>) {
    this.set({ map });
  }

  @Input() set alphaMap(alphaMap: NgtObservableInput<THREE.Texture | null>) {
    this.set({ alphaMap });
  }

  @Input() set depthPacking(depthPacking: NgtObservableInput<THREE.DepthPackingStrategies>) {
    this.set({ depthPacking });
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

  override get materialType(): NgtAnyConstructor<THREE.MeshDepthMaterial> {
    return THREE.MeshDepthMaterial;
  }

  override get optionsFields() {
    return [
      ...super.optionsFields,
      'map',
      'alphaMap',
      'depthPacking',
      'displacementMap',
      'displacementScale',
      'displacementBias',
      'wireframe',
      'wireframeLinewidth',
    ];
  }
}
