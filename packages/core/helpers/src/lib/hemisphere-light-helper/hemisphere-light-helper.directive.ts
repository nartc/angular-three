// GENERATED

import {
  ThreeHelper,
  ThreeObject3d,
  OBJECT_3D_CONTROLLER_PROVIDER,
} from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { HemisphereLightHelper } from 'three';

@Directive({
  selector: 'ngt-hemisphere-light-helper',
  exportAs: 'ngtHemisphereLightHelper',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: HemisphereLightHelperDirective,
    },
    OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class HemisphereLightHelperDirective extends ThreeHelper<HemisphereLightHelper> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof HemisphereLightHelper>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof HemisphereLightHelper>) {
    this.extraArgs = v;
  }

  helperType = HemisphereLightHelper;
}
