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
  selector: '[ngtSpotLightHelper]',
  standalone: true,
  exportAs: 'ngtSpotLightHelper',
  providers: [provideNgtCommonObjectHelper(NgtSpotLightHelper), provideCommonObjectHelperRef(NgtSpotLightHelper)],
})
export class NgtSpotLightHelper extends NgtCommonObjectHelper<THREE.SpotLightHelper> {
  static ngAcceptInputType_ngtSpotLightHelper:
    | NgtTail<ConstructorParameters<typeof THREE.SpotLightHelper>>
    | ''
    | undefined;

  @Input() set ngtSpotLightHelper(v: NgtTail<ConstructorParameters<typeof THREE.SpotLightHelper>> | '') {
    if (v) {
      this.instanceArgs = v;
    }
  }

  override get objectHelperType(): NgtAnyConstructor<THREE.SpotLightHelper> {
    return THREE.SpotLightHelper;
  }
}
