// GENERATED

import {
  ThreeHelper,
  ThreeObject3d,
  OBJECT_3D_CONTROLLER_PROVIDER,
} from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { ArrowHelper } from 'three';

@Directive({
  selector: 'ngt-arrow-helper',
  exportAs: 'ngtArrowHelper',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: ArrowHelperDirective,
    },
    OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class ArrowHelperDirective extends ThreeHelper<ArrowHelper> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof ArrowHelper>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof ArrowHelper>) {
    this.extraArgs = v;
  }

  helperType = ArrowHelper;
}
