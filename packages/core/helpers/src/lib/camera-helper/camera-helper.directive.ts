// GENERATED

import { NgtHelper, NGT_OBJECT_CONTROLLER_PROVIDER } from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-camera-helper',
  exportAs: 'ngtCameraHelper',
  providers: [
    {
      provide: NgtHelper,
      useExisting: NgtCameraHelper,
    },
    NGT_OBJECT_CONTROLLER_PROVIDER,
  ],
})
export class NgtCameraHelper extends NgtHelper<THREE.CameraHelper> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.CameraHelper>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.CameraHelper>) {
    this.helperArgs = v;
  }

  helperType = THREE.CameraHelper;
}

@NgModule({
  declarations: [NgtCameraHelper],
  exports: [NgtCameraHelper],
})
export class NgtCameraHelperModule {}
