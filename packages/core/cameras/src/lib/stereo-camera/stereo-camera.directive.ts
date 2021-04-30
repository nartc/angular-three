// GENERATED

import {
  ThreeCamera,
  ThreeObject3d,
  OBJECT_3D_CONTROLLER_PROVIDER,
} from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { StereoCamera } from 'three';

@Directive({
  selector: 'ngt-stereo-camera',
  exportAs: 'ngtStereoCamera',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: StereoCameraDirective,
    },
    OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class StereoCameraDirective extends ThreeCamera<StereoCamera> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof StereoCamera>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof StereoCamera>) {
    this.extraArgs = v;
  }

  cameraType = StereoCamera;
}
