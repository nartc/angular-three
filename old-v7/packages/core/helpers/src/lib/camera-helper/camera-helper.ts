// GENERATED - AngularThree v7.0.0
import {
  NgtAnyConstructor,
  NgtCommonObjectHelper,
  provideNgtCommonObjectHelper,
  provideCommonObjectHelperRef,
  NgtTail,
} from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: '[ngtCameraHelper]',
  standalone: true,
  exportAs: 'ngtCameraHelper',
  providers: [provideNgtCommonObjectHelper(NgtCameraHelper), provideCommonObjectHelperRef(NgtCameraHelper)],
})
export class NgtCameraHelper extends NgtCommonObjectHelper<THREE.CameraHelper> {
  static ngAcceptInputType_ngtCameraHelper: NgtTail<ConstructorParameters<typeof THREE.CameraHelper>> | '' | undefined;

  @Input() set ngtCameraHelper(v: NgtTail<ConstructorParameters<typeof THREE.CameraHelper>> | '') {
    if (v) {
      this.instanceArgs = v;
    }
  }

  override get objectHelperType(): NgtAnyConstructor<THREE.CameraHelper> {
    return THREE.CameraHelper;
  }
}
