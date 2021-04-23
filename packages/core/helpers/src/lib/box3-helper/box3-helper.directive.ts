// GENERATED

import { ThreeObject3d } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { Box3Helper } from 'three';
import { ThreeHelper } from '../abstracts';

@Directive({
  selector: 'ngt-box3Helper',
  exportAs: 'ngtBox3Helper',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: Box3HelperDirective,
    },
  ],
})
export class Box3HelperDirective extends ThreeHelper<Box3Helper> {
  static ngAcceptInputType_args: ConstructorParameters<typeof Box3Helper> | undefined;

  @Input() set args(v: ConstructorParameters<typeof Box3Helper>) {
    this.extraArgs = v;
  }

  helperType = Box3Helper;
}
