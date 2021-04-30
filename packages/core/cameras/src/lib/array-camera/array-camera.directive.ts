// GENERATED

import {
  ThreeCamera,
  ThreeObject3d,
  OBJECT_3D_CONTROLLER_PROVIDER,
} from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { ArrayCamera } from 'three';

@Directive({
  selector: 'ngt-array-camera',
  exportAs: 'ngtArrayCamera',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: ArrayCameraDirective,
    },
    OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class ArrayCameraDirective extends ThreeCamera<ArrayCamera> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof ArrayCamera>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof ArrayCamera>) {
    this.extraArgs = v;
  }

  cameraType = ArrayCamera;
}
