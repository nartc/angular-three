// GENERATED

import {
  ThreeHelper,
  ThreeObject3d,
  OBJECT_3D_CONTROLLER_PROVIDER,
} from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { Box3Helper } from 'three';

@Directive({
  selector: 'ngt-box3-helper',
  exportAs: 'ngtBox3Helper',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: Box3HelperDirective,
    },
    OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class Box3HelperDirective extends ThreeHelper<Box3Helper> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof Box3Helper>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof Box3Helper>) {
    this.extraArgs = v;
  }

  helperType = Box3Helper;
}
