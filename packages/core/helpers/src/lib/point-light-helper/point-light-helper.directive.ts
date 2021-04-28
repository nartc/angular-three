// GENERATED

import {
  ThreeHelper,
  ThreeObject3d,
  OBJECT_3D_CONTROLLER_PROVIDER,
} from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { PointLightHelper } from 'three';

@Directive({
  selector: 'ngt-point-light-helper',
  exportAs: 'ngtPointLightHelper',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: PointLightHelperDirective,
    },
    OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class PointLightHelperDirective extends ThreeHelper<PointLightHelper> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof PointLightHelper>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof PointLightHelper>) {
    this.extraArgs = v;
  }

  helperType = PointLightHelper;
}
