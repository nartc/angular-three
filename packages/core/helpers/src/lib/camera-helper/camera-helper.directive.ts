// GENERATED

import { ThreeHelper, ThreeObject3d } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { CameraHelper } from 'three';

@Directive({
  selector: 'ngt-cameraHelper',
  exportAs: 'ngtCameraHelper',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: CameraHelperDirective,
    },
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
