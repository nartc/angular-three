// GENERATED

import {
  ThreeHelper,
  ThreeObject3d,
  OBJECT_3D_CONTROLLER_PROVIDER,
} from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { CameraHelper } from 'three';

@Directive({
  selector: 'ngt-camera-helper',
  exportAs: 'ngtCameraHelper',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: CameraHelperDirective,
    },
    OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class CameraHelperDirective extends ThreeHelper<CameraHelper> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof CameraHelper>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof CameraHelper>) {
    this.extraArgs = v;
  }

  helperType = CameraHelper;
}
