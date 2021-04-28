// GENERATED

import {
  ThreeHelper,
  ThreeObject3d,
  OBJECT_3D_CONTROLLER_PROVIDER,
} from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { SkeletonHelper } from 'three';

@Directive({
  selector: 'ngt-skeleton-helper',
  exportAs: 'ngtSkeletonHelper',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: SkeletonHelperDirective,
    },
    OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class SkeletonHelperDirective extends ThreeHelper<SkeletonHelper> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof SkeletonHelper>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof SkeletonHelper>) {
    this.extraArgs = v;
  }

  helperType = SkeletonHelper;
}
