// GENERATED

import {
  ThreeHelper,
  ThreeObject3d,
  OBJECT_3D_CONTROLLER_PROVIDER,
} from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { SpotLightHelper } from 'three';

@Directive({
  selector: 'ngt-spot-light-helper',
  exportAs: 'ngtSpotLightHelper',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: SpotLightHelperDirective,
    },
    OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class SpotLightHelperDirective extends ThreeHelper<SpotLightHelper> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof SpotLightHelper>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof SpotLightHelper>) {
    this.extraArgs = v;
  }

  helperType = SpotLightHelper;
}
