// GENERATED
import { AnyConstructor, NgtCommonLight, provideNgtCommonLight, provideCommonLightRef } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-light-probe',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgtCommonLight(NgtLightProbe), provideCommonLightRef(NgtLightProbe)],
})
export class NgtLightProbe extends NgtCommonLight<THREE.LightProbe> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.LightProbe> | undefined;

  @Input() set sh(sh: THREE.SphericalHarmonics3) {
    this.set({ sh });
  }

  override get lightType(): AnyConstructor<THREE.LightProbe> {
    return THREE.LightProbe;
  }

  protected override get optionFields(): Record<string, boolean> {
    return {
      ...super.optionFields,
      sh: true,
    };
  }
}

@NgModule({
  imports: [NgtLightProbe],
  exports: [NgtLightProbe],
})
export class NgtLightProbeModule {}
