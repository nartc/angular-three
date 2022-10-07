// GENERATED
import {
  AnyConstructor,
  NgtCommonMaterial,
  provideNgtCommonMaterial,
  provideCommonMaterialRef,
  coerceBooleanProperty,
  BooleanInput,
  coerceNumberProperty,
  NumberInput,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-mesh-lambert-material',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgtCommonMaterial(NgtMeshLambertMaterial), provideCommonMaterialRef(NgtMeshLambertMaterial)],
})
export class NgtMeshLambertMaterial extends NgtCommonMaterial<THREE.MeshLambertMaterial> {
  @Input() set color(color: THREE.ColorRepresentation) {
    this.set({ color });
  }

  @Input() set emissive(emissive: THREE.ColorRepresentation) {
    this.set({ emissive });
  }

  @Input() set emissiveIntensity(emissiveIntensity: NumberInput) {
    this.set({ emissiveIntensity: coerceNumberProperty(emissiveIntensity) });
  }

  @Input() set emissiveMap(emissiveMap: THREE.Texture | null) {
    this.set({ emissiveMap });
  }

  @Input() set map(map: THREE.Texture | null) {
    this.set({ map });
  }

  @Input() set lightMap(lightMap: THREE.Texture | null) {
    this.set({ lightMap });
  }

  @Input() set lightMapIntensity(lightMapIntensity: NumberInput) {
    this.set({ lightMapIntensity: coerceNumberProperty(lightMapIntensity) });
  }

  @Input() set aoMap(aoMap: THREE.Texture | null) {
    this.set({ aoMap });
  }

  @Input() set aoMapIntensity(aoMapIntensity: NumberInput) {
    this.set({ aoMapIntensity: coerceNumberProperty(aoMapIntensity) });
  }

  @Input() set specularMap(specularMap: THREE.Texture | null) {
    this.set({ specularMap });
  }

  @Input() set alphaMap(alphaMap: THREE.Texture | null) {
    this.set({ alphaMap });
  }

  @Input() set envMap(envMap: THREE.Texture | null) {
    this.set({ envMap });
  }

  @Input() set combine(combine: THREE.Combine) {
    this.set({ combine });
  }

  @Input() set reflectivity(reflectivity: NumberInput) {
    this.set({ reflectivity: coerceNumberProperty(reflectivity) });
  }

  @Input() set refractionRatio(refractionRatio: NumberInput) {
    this.set({ refractionRatio: coerceNumberProperty(refractionRatio) });
  }

  @Input() set wireframe(wireframe: BooleanInput) {
    this.set({ wireframe: coerceBooleanProperty(wireframe) });
  }

  @Input() set wireframeLinewidth(wireframeLinewidth: NumberInput) {
    this.set({ wireframeLinewidth: coerceNumberProperty(wireframeLinewidth) });
  }

  @Input() set wireframeLinecap(wireframeLinecap: string) {
    this.set({ wireframeLinecap });
  }

  @Input() set wireframeLinejoin(wireframeLinejoin: string) {
    this.set({ wireframeLinejoin });
  }

  @Input() set fog(fog: BooleanInput) {
    this.set({ fog: coerceBooleanProperty(fog) });
  }

  get materialType(): AnyConstructor<THREE.MeshLambertMaterial> {
    return THREE.MeshLambertMaterial;
  }

  protected override get optionFields(): Record<string, boolean> {
    return {
      ...super.optionFields,
      color: true,
      emissive: true,
      emissiveIntensity: true,
      emissiveMap: true,
      map: true,
      lightMap: true,
      lightMapIntensity: true,
      aoMap: true,
      aoMapIntensity: true,
      specularMap: true,
      alphaMap: true,
      envMap: true,
      combine: true,
      reflectivity: true,
      refractionRatio: true,
      wireframe: true,
      wireframeLinewidth: true,
      wireframeLinecap: true,
      wireframeLinejoin: true,
      fog: true,
    };
  }
}

@NgModule({
  imports: [NgtMeshLambertMaterial],
  exports: [NgtMeshLambertMaterial],
})
export class NgtMeshLambertMaterialModule {}
