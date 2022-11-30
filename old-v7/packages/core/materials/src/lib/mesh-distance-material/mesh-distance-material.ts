// GENERATED - AngularThree v7.0.0
import {
  coerceNumber,
  NgtAnyConstructor,
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
  selector: 'ngt-mesh-distance-material',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonMaterial(NgtMeshDistanceMaterial), provideCommonMaterialRef(NgtMeshDistanceMaterial)],
})
export class NgtMeshDistanceMaterial extends NgtCommonMaterial<THREE.MeshDistanceMaterial> {
  @Input() set map(map: NgtObservableInput<THREE.Texture | null>) {
    this.set({ map });
  }

  @Input() set alphaMap(alphaMap: NgtObservableInput<THREE.Texture | null>) {
    this.set({ alphaMap });
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

  @Input() set farDistance(farDistance: NgtObservableInput<NgtNumberInput>) {
    this.set({
      farDistance: isObservable(farDistance) ? farDistance.pipe(map(coerceNumber)) : coerceNumber(farDistance),
    });
  }

  @Input() set nearDistance(nearDistance: NgtObservableInput<NgtNumberInput>) {
    this.set({
      nearDistance: isObservable(nearDistance) ? nearDistance.pipe(map(coerceNumber)) : coerceNumber(nearDistance),
    });
  }

  @Input() set referencePosition(referencePosition: NgtObservableInput<THREE.Vector3>) {
    this.set({ referencePosition });
  }

  override get materialType(): NgtAnyConstructor<THREE.MeshDistanceMaterial> {
    return THREE.MeshDistanceMaterial;
  }

  override get optionsFields() {
    return [
      ...super.optionsFields,
      'map',
      'alphaMap',
      'displacementMap',
      'displacementScale',
      'displacementBias',
      'farDistance',
      'nearDistance',
      'referencePosition',
    ];
  }
}
