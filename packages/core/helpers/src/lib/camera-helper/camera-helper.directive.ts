// GENERATED

import {
  NgtHelper,
  NgtObject3d,
  NGT_OBJECT_3D_CONTROLLER_PROVIDER,
} from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-camera-helper',
  exportAs: 'ngtCameraHelper',
  providers: [
    {
      provide: NgtObject3d,
      useExisting: NgtCameraHelper,
    },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtCameraHelper extends NgtHelper<THREE.CameraHelper> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.CameraHelper>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.CameraHelper>) {
    this.extraArgs = v;
  }

  helperType = THREE.CameraHelper;
}
