// GENERATED - AngularThree v7.0.0
import {
  AnyConstructor,
  NgtCommonMaterial,
  provideNgtCommonMaterial,
  provideCommonMaterialRef,
  coerceNumberProperty,
  NumberInput,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-mesh-distance-material',
  standalone: true,
  template: '<ng-content></ng-content>',

  providers: [
    provideNgtCommonMaterial(NgtMeshDistanceMaterial),
    provideCommonMaterialRef(NgtMeshDistanceMaterial),
  ],
})
export class NgtMeshDistanceMaterial extends NgtCommonMaterial<THREE.MeshDistanceMaterial> {
  @Input() set map(map: THREE.Texture | null) {
    this.set({ map });
  }

  @Input() set alphaMap(alphaMap: THREE.Texture | null) {
    this.set({ alphaMap });
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

  @Input() set farDistance(farDistance: NumberInput) {
    this.set({ farDistance: coerceNumberProperty(farDistance) });
  }

  @Input() set nearDistance(nearDistance: NumberInput) {
    this.set({ nearDistance: coerceNumberProperty(nearDistance) });
  }

  @Input() set referencePosition(referencePosition: THREE.Vector3) {
    this.set({ referencePosition });
  }

  override get materialType(): AnyConstructor<THREE.MeshDistanceMaterial> {
    return THREE.MeshDistanceMaterial;
  }

  override get optionsFields(): Record<string, boolean> {
    return {
      ...super.optionsFields,
      map: true,
      alphaMap: true,
      displacementMap: true,
      displacementScale: true,
      displacementBias: true,
      farDistance: true,
      nearDistance: true,
      referencePosition: true,
    };
  }
}
