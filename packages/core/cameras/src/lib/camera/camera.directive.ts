// GENERATED
import {
  NgtCommonCamera,
  NGT_OBJECT_CONTROLLER_PROVIDER,
  NgtObject3dControllerModule,
} from '@angular-three/core';
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
    NGT_OBJECT_CONTROLLER_PROVIDER,
  ],
})
export class NgtCamera extends NgtCommonCamera<THREE.Camera> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.Camera>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.Camera>) {
    this.cameraArgs = v;
  }

  cameraType = THREE.Camera;
}

@NgModule({
  declarations: [NgtCamera],
  exports: [NgtCamera, NgtObject3dControllerModule],
})
export class NgtCameraModule {}
