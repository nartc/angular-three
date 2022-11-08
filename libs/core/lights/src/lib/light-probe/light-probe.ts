// GENERATED
import {
  AnyConstructor,
  NgtCommonLight,
  provideNgtCommonLight,
  provideCommonLightRef,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-light-probe',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideNgtCommonLight(NgtLightProbe),
    provideCommonLightRef(NgtLightProbe),
  ],
})
export class NgtLightProbe extends NgtCommonLight<THREE.LightProbe> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.LightProbe>
    | undefined;

  @Input() set sh(sh: THREE.SphericalHarmonics3) {
    this.set({ sh });
  }

  override get lightType(): AnyConstructor<THREE.LightProbe> {
    return THREE.LightProbe;
  }

  override get optionsFields(): Record<string, boolean> {
    return {
      ...super.optionsFields,
      sh: true,
    };
  }
}
