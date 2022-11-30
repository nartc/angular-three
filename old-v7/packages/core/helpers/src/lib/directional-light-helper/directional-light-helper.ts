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
  selector: '[ngtDirectionalLightHelper]',
  standalone: true,
  exportAs: 'ngtDirectionalLightHelper',
  providers: [
    provideNgtCommonObjectHelper(NgtDirectionalLightHelper),
    provideCommonObjectHelperRef(NgtDirectionalLightHelper),
  ],
})
export class NgtDirectionalLightHelper extends NgtCommonObjectHelper<THREE.DirectionalLightHelper> {
  static ngAcceptInputType_ngtDirectionalLightHelper:
    | NgtTail<ConstructorParameters<typeof THREE.DirectionalLightHelper>>
    | ''
    | undefined;

  @Input() set ngtDirectionalLightHelper(v: NgtTail<ConstructorParameters<typeof THREE.DirectionalLightHelper>> | '') {
    if (v) {
      this.instanceArgs = v;
    }
  }

  override get objectHelperType(): NgtAnyConstructor<THREE.DirectionalLightHelper> {
    return THREE.DirectionalLightHelper;
  }
}
