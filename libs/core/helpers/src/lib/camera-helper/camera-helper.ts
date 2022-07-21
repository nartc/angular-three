// GENERATED
import { AnyConstructor, NgtCommonObjectHelper, provideCommonObjectHelperRef, Tail } from '@angular-three/core';
import { Directive, Input, NgModule } from '@angular/core';
import * as THREE from 'three/src/Three';

@Directive({
  selector: '[ngtCameraHelper]',
  exportAs: 'ngtCameraHelper',
  providers: [provideCommonObjectHelperRef(NgtCameraHelper)],
})
export class NgtCameraHelper extends NgtCommonObjectHelper<THREE.CameraHelper> {
  static ngAcceptInputType_ngtCameraHelper: Tail<ConstructorParameters<typeof THREE.CameraHelper>> | '' | undefined;

  @Input() set ngtCameraHelper(v: Tail<ConstructorParameters<typeof THREE.CameraHelper>> | '') {
    if (v) {
      this.instanceArgs = v;
    }
  }

  override get objectHelperType(): AnyConstructor<THREE.CameraHelper> {
    return THREE.CameraHelper;
  }
}

@NgModule({
  declarations: [NgtCameraHelper],
  exports: [NgtCameraHelper],
})
export class NgtCameraHelperModule {}
