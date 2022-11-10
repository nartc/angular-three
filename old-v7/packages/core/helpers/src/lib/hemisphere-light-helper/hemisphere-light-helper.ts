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
  selector: '[ngtHemisphereLightHelper]',
  standalone: true,
  exportAs: 'ngtHemisphereLightHelper',
  providers: [
    provideNgtCommonObjectHelper(NgtHemisphereLightHelper),
    provideCommonObjectHelperRef(NgtHemisphereLightHelper),
  ],
})
export class NgtHemisphereLightHelper extends NgtCommonObjectHelper<THREE.HemisphereLightHelper> {
  static ngAcceptInputType_ngtHemisphereLightHelper:
    | NgtTail<ConstructorParameters<typeof THREE.HemisphereLightHelper>>
    | ''
    | undefined;

  @Input() set ngtHemisphereLightHelper(v: NgtTail<ConstructorParameters<typeof THREE.HemisphereLightHelper>> | '') {
    if (v) {
      this.instanceArgs = v;
    }
  }

  override get objectHelperType(): NgtAnyConstructor<THREE.HemisphereLightHelper> {
    return THREE.HemisphereLightHelper;
  }
}
