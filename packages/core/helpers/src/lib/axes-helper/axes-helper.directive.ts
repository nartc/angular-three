// GENERATED

import {
  ThreeHelper,
  ThreeObject3d,
  OBJECT_3D_CONTROLLER_PROVIDER,
} from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { AxesHelper } from 'three';

@Directive({
  selector: 'ngt-axes-helper',
  exportAs: 'ngtAxesHelper',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: AxesHelperDirective,
    },
    OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class AxesHelperDirective extends ThreeHelper<AxesHelper> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof AxesHelper>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof AxesHelper>) {
    this.extraArgs = v;
  }

  helperType = AxesHelper;
}
