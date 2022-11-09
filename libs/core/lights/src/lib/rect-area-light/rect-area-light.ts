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
  selector: 'ngt-rect-area-light',
  standalone: true,
  template: '<ng-content></ng-content>',

  providers: [
    provideNgtCommonLight(NgtRectAreaLight),
    provideCommonLightRef(NgtRectAreaLight),
  ],
})
export class NgtRectAreaLight extends NgtCommonLight<THREE.RectAreaLight> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.RectAreaLight>
    | undefined;

  @Input() set width(width: NumberInput) {
    this.set({ width: coerceNumberProperty(width) });
  }

  @Input() set height(height: NumberInput) {
    this.set({ height: coerceNumberProperty(height) });
  }

  @Input() set power(power: NumberInput) {
    this.set({ power: coerceNumberProperty(power) });
  }

  override get lightType(): AnyConstructor<THREE.RectAreaLight> {
    return THREE.RectAreaLight;
  }

  override get optionsFields(): Record<string, boolean> {
    return {
      ...super.optionsFields,
      width: true,
      height: true,
      power: true,
    };
  }
}
