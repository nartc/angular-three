// GENERATED
import {
  NGT_OBJECT_PROVIDER,
  NgtObjectHelper,
  Tail,
} from '@angular-three/core';
import { Directive, Input, NgModule } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: '[ngtCameraHelper]',
  exportAs: 'ngtCameraHelper',
  providers: [
    {
      provide: NgtObjectHelper,
      useExisting: NgtCameraHelper,
    },
    NGT_OBJECT_PROVIDER,
  ],
})
export class NgtCameraHelper extends NgtObjectHelper<THREE.CameraHelper> {
  static ngAcceptInputType_ngtCameraHelper:
    | Tail<ConstructorParameters<typeof THREE.CameraHelper>>
    | ''
    | undefined;

  @Input() set ngtCameraHelper(
    v: Tail<ConstructorParameters<typeof THREE.CameraHelper>> | ''
  ) {
    if (v) {
      this.objectHelperArgs = v;
    }
  }

  objectHelperType = THREE.CameraHelper;
}

@NgModule({
  declarations: [NgtCameraHelper],
  exports: [NgtCameraHelper],
})
export class NgtCameraHelperModule {}
