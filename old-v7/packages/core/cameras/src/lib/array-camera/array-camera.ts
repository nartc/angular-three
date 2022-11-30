// GENERATED - AngularThree v7.0.0
import {
  NgtAnyConstructor,
  NgtCommonCamera,
  NgtObservableInput,
  provideCommonCameraRef,
  provideNgtCommonCamera,
} from '@angular-three/core';
import { Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-array-camera',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonCamera(NgtArrayCamera), provideCommonCameraRef(NgtArrayCamera)],
})
export class NgtArrayCamera extends NgtCommonCamera<THREE.ArrayCamera> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.ArrayCamera> | undefined;

  @Input() set cameras(cameras: NgtObservableInput<THREE.PerspectiveCamera[]>) {
    this.set({ cameras });
  }

  override get cameraType(): NgtAnyConstructor<THREE.ArrayCamera> {
    return THREE.ArrayCamera;
  }

  override get optionsFields() {
    return [...super.optionsFields, 'cameras'];
  }
}
