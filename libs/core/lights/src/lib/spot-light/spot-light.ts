// GENERATED
import {
  AnyConstructor,
  NgtCommonLight,
  provideCommonLightRef,
  coerceNumberProperty,
  NumberInput,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-spot-light',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonLightRef(NgtSpotLight)],
})
export class NgtSpotLight extends NgtCommonLight<THREE.SpotLight> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.SpotLight> | undefined;

  @Input() set distance(distance: NumberInput) {
    this.set({ distance: coerceNumberProperty(distance) });
  }

  @Input() set angle(angle: NumberInput) {
    this.set({ angle: coerceNumberProperty(angle) });
  }

  @Input() set penumbra(penumbra: NumberInput) {
    this.set({ penumbra: coerceNumberProperty(penumbra) });
  }

  @Input() set decay(decay: NumberInput) {
    this.set({ decay: coerceNumberProperty(decay) });
  }

  @Input() set target(target: THREE.Object3D) {
    this.set({ target });
  }

  @Input() set power(power: NumberInput) {
    this.set({ power: coerceNumberProperty(power) });
  }

  override get lightType(): AnyConstructor<THREE.SpotLight> {
    return THREE.SpotLight;
  }

  protected override get optionFields(): Record<string, boolean> {
    return {
      ...super.optionFields,
      distance: true,
      angle: true,
      penumbra: true,
      decay: true,
      target: true,
      power: true,
    };
  }
}

@NgModule({
  imports: [NgtSpotLight],
  exports: [NgtSpotLight],
})
export class NgtSpotLightModule {}
