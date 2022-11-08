// GENERATED
import {
  AnyConstructor,
  NgtCommonLight,
  provideNgtCommonLight,
  provideCommonLightRef,
  coerceNumberProperty,
  NumberInput,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-point-light',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideNgtCommonLight(NgtPointLight),
    provideCommonLightRef(NgtPointLight),
  ],
})
export class NgtPointLight extends NgtCommonLight<THREE.PointLight> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.PointLight>
    | undefined;

  @Input() set distance(distance: NumberInput) {
    this.set({ distance: coerceNumberProperty(distance) });
  }

  @Input() set decay(decay: NumberInput) {
    this.set({ decay: coerceNumberProperty(decay) });
  }

  @Input() set power(power: NumberInput) {
    this.set({ power: coerceNumberProperty(power) });
  }

  override get lightType(): AnyConstructor<THREE.PointLight> {
    return THREE.PointLight;
  }

  override get optionsFields(): Record<string, boolean> {
    return {
      ...super.optionsFields,
      distance: true,
      decay: true,
      power: true,
    };
  }
}
