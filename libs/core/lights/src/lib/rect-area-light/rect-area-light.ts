// GENERATED
import {
  AnyConstructor,
  coerceNumberProperty,
  NgtCommonLight,
  NumberInput,
  provideCommonLightRef,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import * as THREE from 'three/src/Three';

@Component({
  selector: 'ngt-rect-area-light',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonLightRef(NgtRectAreaLight)],
})
export class NgtRectAreaLight extends NgtCommonLight<THREE.RectAreaLight> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.RectAreaLight> | undefined;

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

  protected override get optionFields(): Record<string, boolean> {
    return {
      ...super.optionFields,
      width: true,
      height: true,
      power: true,
    };
  }
}

@NgModule({
  declarations: [NgtRectAreaLight],
  exports: [NgtRectAreaLight],
})
export class NgtRectAreaLightModule {}
