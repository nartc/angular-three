// GENERATED - AngularThree v7.0.0
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
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-sprite-material',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideNgtCommonMaterial(NgtSpriteMaterial),
    provideCommonMaterialRef(NgtSpriteMaterial),
  ],
})
export class NgtSpriteMaterial extends NgtCommonMaterial<THREE.SpriteMaterial> {
  @Input() set color(color: THREE.ColorRepresentation) {
    this.set({ color });
  }

  @Input() set map(map: THREE.Texture | null) {
    this.set({ map });
  }

  @Input() set alphaMap(alphaMap: THREE.Texture | null) {
    this.set({ alphaMap });
  }

  @Input() set rotation(rotation: NumberInput) {
    this.set({ rotation: coerceNumberProperty(rotation) });
  }

  @Input() set sizeAttenuation(sizeAttenuation: BooleanInput) {
    this.set({ sizeAttenuation: coerceBooleanProperty(sizeAttenuation) });
  }

  @Input() set fog(fog: BooleanInput) {
    this.set({ fog: coerceBooleanProperty(fog) });
  }

  override get materialType(): AnyConstructor<THREE.SpriteMaterial> {
    return THREE.SpriteMaterial;
  }

  override get optionsFields(): Record<string, boolean> {
    return {
      ...super.optionsFields,
      color: true,
      map: true,
      alphaMap: true,
      rotation: true,
      sizeAttenuation: true,
      fog: true,
    };
  }
}
