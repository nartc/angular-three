// GENERATED

import {
  ThreeHelper,
  ThreeObject3d,
  OBJECT_3D_CONTROLLER_PROVIDER,
} from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { DirectionalLightHelper } from 'three';

@Directive({
  selector: 'ngt-directional-light-helper',
  exportAs: 'ngtDirectionalLightHelper',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: DirectionalLightHelperDirective,
    },
    OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class DirectionalLightHelperDirective extends ThreeHelper<DirectionalLightHelper> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof DirectionalLightHelper>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof DirectionalLightHelper>) {
    this.extraArgs = v;
  }

  helperType = DirectionalLightHelper;
}
