// GENERATED
import { AnyConstructor, NgtCommonCamera, provideNgtCommonCamera, provideCommonCameraRef } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-stereo-camera',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgtCommonCamera(NgtStereoCamera), provideCommonCameraRef(NgtStereoCamera)],
})
export class NgtStereoCamera extends NgtCommonCamera<THREE.StereoCamera> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.StereoCamera> | undefined;

  override get cameraType(): AnyConstructor<THREE.StereoCamera> {
    return THREE.StereoCamera;
  }
}

@NgModule({
  imports: [NgtStereoCamera],
  exports: [NgtStereoCamera],
})
export class NgtStereoCameraModule {}
