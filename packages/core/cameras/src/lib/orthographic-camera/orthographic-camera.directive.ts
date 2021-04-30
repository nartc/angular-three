// GENERATED

import {
  ThreeCamera,
  ThreeObject3d,
  OBJECT_3D_CONTROLLER_PROVIDER,
} from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { OrthographicCamera } from 'three';

@Directive({
  selector: 'ngt-orthographic-camera',
  exportAs: 'ngtOrthographicCamera',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: OrthographicCameraDirective,
    },
    OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class OrthographicCameraDirective extends ThreeCamera<OrthographicCamera> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof OrthographicCamera>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof OrthographicCamera>) {
    this.extraArgs = v;
  }

  cameraType = OrthographicCamera;
}
