// GENERATED

import {
  NgtHelper,
  NgtObject3d,
  NGT_OBJECT_3D_CONTROLLER_PROVIDER,
} from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-skeleton-helper',
  exportAs: 'ngtSkeletonHelper',
  providers: [
    {
      provide: NgtObject3d,
      useExisting: NgtSkeletonHelper,
    },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtSkeletonHelper extends NgtHelper<THREE.SkeletonHelper> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.SkeletonHelper>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.SkeletonHelper>) {
    this.extraArgs = v;
  }

  helperType = THREE.SkeletonHelper;
}
