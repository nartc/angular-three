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
  selector: '[ngtSkeletonHelper]',
  standalone: true,
  exportAs: 'ngtSkeletonHelper',
  providers: [provideNgtCommonObjectHelper(NgtSkeletonHelper), provideCommonObjectHelperRef(NgtSkeletonHelper)],
})
export class NgtSkeletonHelper extends NgtCommonObjectHelper<THREE.SkeletonHelper> {
  static ngAcceptInputType_ngtSkeletonHelper:
    | NgtTail<ConstructorParameters<typeof THREE.SkeletonHelper>>
    | ''
    | undefined;

  @Input() set ngtSkeletonHelper(v: NgtTail<ConstructorParameters<typeof THREE.SkeletonHelper>> | '') {
    if (v) {
      this.instanceArgs = v;
    }
  }

  override get objectHelperType(): NgtAnyConstructor<THREE.SkeletonHelper> {
    return THREE.SkeletonHelper;
  }
}
