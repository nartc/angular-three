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
  selector: 'ngt-ambient-light-probe',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonLight(NgtAmbientLightProbe), provideCommonLightRef(NgtAmbientLightProbe)],
})
export class NgtAmbientLightProbe extends NgtCommonLight<THREE.AmbientLightProbe> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.AmbientLightProbe> | undefined;

  override get lightType(): NgtAnyConstructor<THREE.AmbientLightProbe> {
    return THREE.AmbientLightProbe;
  }
}
