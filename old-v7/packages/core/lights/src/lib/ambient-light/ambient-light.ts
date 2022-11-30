// GENERATED - AngularThree v7.0.0
import { NgtAnyConstructor, NgtCommonLight, provideCommonLightRef, provideNgtCommonLight } from '@angular-three/core';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-ambient-light',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonLight(NgtAmbientLight), provideCommonLightRef(NgtAmbientLight)],
})
export class NgtAmbientLight extends NgtCommonLight<THREE.AmbientLight> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.AmbientLight> | undefined;

  override get lightType(): NgtAnyConstructor<THREE.AmbientLight> {
    return THREE.AmbientLight;
  }
}
