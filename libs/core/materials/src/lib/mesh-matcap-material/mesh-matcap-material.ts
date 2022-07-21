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
import * as THREE from 'three/src/Three';

@Component({
  selector: 'ngt-mesh-matcap-material',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonMaterialRef(NgtMeshMatcapMaterial)],
})
export class NgtMeshMatcapMaterial extends NgtCommonMaterial<
  THREE.MeshMatcapMaterialParameters,
  THREE.MeshMatcapMaterial
> {
  static ngAcceptInputType_parameters: THREE.MeshMatcapMaterialParameters | undefined;

  @Input() set color(color: THREE.ColorRepresentation) {
    this.set({ color });
  }

  @Input() set matcap(matcap: THREE.Texture | null) {
    this.set({ matcap });
  }

  @Input() set map(map: THREE.Texture | null) {
    this.set({ map });
  }

  @Input() set bumpMap(bumpMap: THREE.Texture | null) {
    this.set({ bumpMap });
  }

  @Input() set bumpScale(bumpScale: NumberInput) {
    this.set({ bumpScale: coerceNumberProperty(bumpScale) });
  }

  @Input() set normalMap(normalMap: THREE.Texture | null) {
    this.set({ normalMap });
  }

  @Input() set normalMapType(normalMapType: THREE.NormalMapTypes) {
    this.set({ normalMapType });
  }

  @Input() set normalScale(normalScale: THREE.Vector2) {
    this.set({ normalScale });
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

  @Input() set alphaMap(alphaMap: THREE.Texture | null) {
    this.set({ alphaMap });
  }

  @Input() set fog(fog: BooleanInput) {
    this.set({ fog: coerceBooleanProperty(fog) });
  }

  @Input() set flatShading(flatShading: BooleanInput) {
    this.set({ flatShading: coerceBooleanProperty(flatShading) });
  }

  get materialType(): AnyConstructor<THREE.MeshMatcapMaterial> {
    return THREE.MeshMatcapMaterial;
  }

  protected override get optionFields(): Record<string, boolean> {
    return {
      ...super.optionFields,
      color: true,
      matcap: true,
      map: true,
      bumpMap: true,
      bumpScale: true,
      normalMap: true,
      normalMapType: true,
      normalScale: true,
      displacementMap: true,
      displacementScale: true,
      displacementBias: true,
      alphaMap: true,
      fog: true,
      flatShading: true,
    };
  }
}

@NgModule({
  imports: [NgtMeshMatcapMaterial],
  exports: [NgtMeshMatcapMaterial],
})
export class NgtMeshMatcapMaterialModule {}
