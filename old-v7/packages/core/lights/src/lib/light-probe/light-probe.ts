// GENERATED - AngularThree v7.0.0
import {
  NgtAnyConstructor,
  NgtCommonLight,
  provideNgtCommonLight,
  provideCommonLightRef,
  NgtObservableInput,
} from '@angular-three/core';
import { Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-light-probe',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonLight(NgtLightProbe), provideCommonLightRef(NgtLightProbe)],
})
export class NgtLightProbe extends NgtCommonLight<THREE.LightProbe> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.LightProbe> | undefined;

  @Input() set sh(sh: NgtObservableInput<THREE.SphericalHarmonics3>) {
    this.set({ sh });
  }

  override get lightType(): NgtAnyConstructor<THREE.LightProbe> {
    return THREE.LightProbe;
  }

  override get optionsFields() {
    return [...super.optionsFields, 'sh'];
  }
}
