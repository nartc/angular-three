// GENERATED

import {
  ThreeCamera,
  ThreeObject3d,
  OBJECT_3D_CONTROLLER_PROVIDER,
} from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { Camera } from 'three';

@Directive({
  selector: 'ngt-camera',
  exportAs: 'ngtCamera',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: CameraDirective,
    },
    OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class CameraDirective extends ThreeCamera<Camera> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof Camera>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof Camera>) {
    this.extraArgs = v;
  }

  cameraType = Camera;
}
