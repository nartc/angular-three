// GENERATED

import { NgtCommonCamera, NgtObject3d, NGT_OBJECT_3D_CONTROLLER_PROVIDER } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-stereo-camera',
  exportAs: 'ngtStereoCamera',
  providers: [
    {
      provide: NgtObject3d,
      useExisting: NgtStereoCamera,
    },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtStereoCamera extends NgtCommonCamera<THREE.StereoCamera> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.StereoCamera> | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.StereoCamera>) {
    this.extraArgs = v;
  }

  cameraType = THREE.StereoCamera;
}
