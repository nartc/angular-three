// GENERATED

import {
  ThreeCamera,
  ThreeObject3d,
  OBJECT_3D_CONTROLLER_PROVIDER,
} from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { PerspectiveCamera } from 'three';

@Directive({
  selector: 'ngt-perspective-camera',
  exportAs: 'ngtPerspectiveCamera',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: PerspectiveCameraDirective,
    },
    OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class PerspectiveCameraDirective extends ThreeCamera<PerspectiveCamera> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof PerspectiveCamera>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof PerspectiveCamera>) {
    this.extraArgs = v;
  }

  cameraType = PerspectiveCamera;
}
