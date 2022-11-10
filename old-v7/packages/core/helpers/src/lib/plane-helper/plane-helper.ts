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
  selector: '[ngtPlaneHelper]',
  standalone: true,
  exportAs: 'ngtPlaneHelper',
  providers: [provideNgtCommonObjectHelper(NgtPlaneHelper), provideCommonObjectHelperRef(NgtPlaneHelper)],
})
export class NgtPlaneHelper extends NgtCommonObjectHelper<THREE.PlaneHelper> {
  static ngAcceptInputType_ngtPlaneHelper: NgtTail<ConstructorParameters<typeof THREE.PlaneHelper>> | '' | undefined;

  @Input() set ngtPlaneHelper(v: NgtTail<ConstructorParameters<typeof THREE.PlaneHelper>> | '') {
    if (v) {
      this.instanceArgs = v;
    }
  }

  override get objectHelperType(): NgtAnyConstructor<THREE.PlaneHelper> {
    return THREE.PlaneHelper;
  }
}
