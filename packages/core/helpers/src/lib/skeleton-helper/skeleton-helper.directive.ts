// GENERATED

import { ThreeHelper, ThreeObject3d } from '@angular-three/core';
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
