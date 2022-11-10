// GENERATED - AngularThree v7.0.0
import {
  NgtAnyConstructor,
  NgtCommonCamera,
  provideNgtCommonCamera,
  provideCommonCameraRef,
  NgtObservableInput,
} from '@angular-three/core';
import { Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-stereo-camera',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonCamera(NgtStereoCamera), provideCommonCameraRef(NgtStereoCamera)],
})
export class NgtStereoCamera extends NgtCommonCamera<THREE.StereoCamera> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.StereoCamera> | undefined;

  override get cameraType(): NgtAnyConstructor<THREE.StereoCamera> {
    return THREE.StereoCamera;
  }
}
