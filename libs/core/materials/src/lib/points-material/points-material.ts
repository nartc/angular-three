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
  selector: 'ngt-points-material',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgtCommonMaterial(NgtPointsMaterial), provideCommonMaterialRef(NgtPointsMaterial)],
})
export class NgtPointsMaterial extends NgtCommonMaterial<THREE.PointsMaterial> {
  @Input() set color(color: THREE.ColorRepresentation) {
    this.set({ color });
  }

  @Input() set map(map: THREE.Texture | null) {
    this.set({ map });
  }

  @Input() set alphaMap(alphaMap: THREE.Texture | null) {
    this.set({ alphaMap });
  }

  @Input() set size(size: NumberInput) {
    this.set({ size: coerceNumberProperty(size) });
  }

  @Input() set sizeAttenuation(sizeAttenuation: BooleanInput) {
    this.set({ sizeAttenuation: coerceBooleanProperty(sizeAttenuation) });
  }

  @Input() set fog(fog: BooleanInput) {
    this.set({ fog: coerceBooleanProperty(fog) });
  }

  get materialType(): AnyConstructor<THREE.PointsMaterial> {
    return THREE.PointsMaterial;
  }

  protected override get optionFields(): Record<string, boolean> {
    return {
      ...super.optionFields,
      color: true,
      map: true,
      alphaMap: true,
      size: true,
      sizeAttenuation: true,
      fog: true,
    };
  }
}

@NgModule({
  imports: [NgtPointsMaterial],
  exports: [NgtPointsMaterial],
})
export class NgtPointsMaterialModule {}
