// GENERATED
import {
  AnyConstructor,
  NgtCommonMaterial,
  provideCommonMaterialRef,
  coerceBooleanProperty,
  BooleanInput,
  coerceNumberProperty,
  NumberInput,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-mesh-depth-material',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonMaterialRef(NgtMeshDepthMaterial)],
})
export class NgtMeshDepthMaterial extends NgtCommonMaterial<
  THREE.MeshDepthMaterialParameters,
  THREE.MeshDepthMaterial
> {
  static ngAcceptInputType_parameters: THREE.MeshDepthMaterialParameters | undefined;

  @Input() set map(map: THREE.Texture | null) {
    this.set({ map });
  }

  @Input() set alphaMap(alphaMap: THREE.Texture | null) {
    this.set({ alphaMap });
  }

  @Input() set depthPacking(depthPacking: THREE.DepthPackingStrategies) {
    this.set({ depthPacking });
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

  @Input() set wireframe(wireframe: BooleanInput) {
    this.set({ wireframe: coerceBooleanProperty(wireframe) });
  }

  @Input() set wireframeLinewidth(wireframeLinewidth: NumberInput) {
    this.set({ wireframeLinewidth: coerceNumberProperty(wireframeLinewidth) });
  }

  get materialType(): AnyConstructor<THREE.MeshDepthMaterial> {
    return THREE.MeshDepthMaterial;
  }

  protected override get optionFields(): Record<string, boolean> {
    return {
      ...super.optionFields,
      map: true,
      alphaMap: true,
      depthPacking: true,
      displacementMap: true,
      displacementScale: true,
      displacementBias: true,
      wireframe: true,
      wireframeLinewidth: true,
    };
  }
}

@NgModule({
  imports: [NgtMeshDepthMaterial],
  exports: [NgtMeshDepthMaterial],
})
export class NgtMeshDepthMaterialModule {}
