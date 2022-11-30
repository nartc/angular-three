// GENERATED - AngularThree v7.0.0
import {
  NgtAnyConstructor,
  NgtCommonObjectHelper,
  NgtTail,
  provideCommonObjectHelperRef,
  provideNgtCommonObjectHelper,
} from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: '[ngtPointLightHelper]',
  standalone: true,
  exportAs: 'ngtPointLightHelper',
  providers: [provideNgtCommonObjectHelper(NgtPointLightHelper), provideCommonObjectHelperRef(NgtPointLightHelper)],
})
export class NgtPointLightHelper extends NgtCommonObjectHelper<THREE.PointLightHelper> {
  static ngAcceptInputType_ngtPointLightHelper:
    | NgtTail<ConstructorParameters<typeof THREE.PointLightHelper>>
    | ''
    | undefined;

  @Input() set ngtPointLightHelper(v: NgtTail<ConstructorParameters<typeof THREE.PointLightHelper>> | '') {
    if (v) {
      this.instanceArgs = v;
    }
  }

  override get objectHelperType(): NgtAnyConstructor<THREE.PointLightHelper> {
    return THREE.PointLightHelper;
  }
}
