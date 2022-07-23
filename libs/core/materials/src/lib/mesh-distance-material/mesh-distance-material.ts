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

@Component({
  selector: 'ngt-mesh-distance-material',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgtCommonMaterial(NgtMeshDistanceMaterial), provideCommonMaterialRef(NgtMeshDistanceMaterial)],
})
export class NgtMeshDistanceMaterial extends NgtCommonMaterial<
  THREE.MeshDistanceMaterialParameters,
  THREE.MeshDistanceMaterial
> {
  static ngAcceptInputType_parameters: THREE.MeshDistanceMaterialParameters | undefined;

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

  get materialType(): AnyConstructor<THREE.MeshDistanceMaterial> {
    return THREE.MeshDistanceMaterial;
  }

  protected override get optionFields(): Record<string, boolean> {
    return {
      ...super.optionFields,
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

@NgModule({
  imports: [NgtMeshDistanceMaterial],
  exports: [NgtMeshDistanceMaterial],
})
export class NgtMeshDistanceMaterialModule {}
