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
  selector: 'ngt-point-light',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonLightRef(NgtPointLight)],
})
export class NgtPointLight extends NgtCommonLight<THREE.PointLight> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.PointLight> | undefined;

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

  protected override get optionFields(): Record<string, boolean> {
    return {
      ...super.optionFields,
      distance: true,
      decay: true,
      power: true,
    };
  }
}

@NgModule({
  declarations: [NgtPointLight],
  exports: [NgtPointLight],
})
export class NgtPointLightModule {}
