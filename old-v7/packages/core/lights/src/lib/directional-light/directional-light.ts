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
  selector: 'ngt-directional-light',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonLight(NgtDirectionalLight), provideCommonLightRef(NgtDirectionalLight)],
})
export class NgtDirectionalLight extends NgtCommonLight<THREE.DirectionalLight> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.DirectionalLight> | undefined;

  @Input() set target(target: NgtObservableInput<THREE.Object3D>) {
    this.set({ target });
  }

  override get lightType(): NgtAnyConstructor<THREE.DirectionalLight> {
    return THREE.DirectionalLight;
  }

  override get optionsFields() {
    return [...super.optionsFields, 'target'];
  }
}