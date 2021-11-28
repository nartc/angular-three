// GENERATED

import { NgtCommonCamera, NgtObject3d, NGT_OBJECT_3D_CONTROLLER_PROVIDER } from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-camera',
  exportAs: 'ngtCamera',
  providers: [
    {
      provide: NgtCommonCamera,
      useExisting: NgtCamera,
    },
    {
      provide: NgtObject3d,
      useExisting: NgtCamera,
    },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtCamera extends NgtCommonCamera<THREE.Camera> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.Camera> | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.Camera>) {
    this.extraArgs = v;
  }

  cameraType = THREE.Camera;
}

@NgModule({
  declarations: [NgtCamera],
  exports: [NgtCamera],
})
export class NgtCameraModule {}

