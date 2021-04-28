// GENERATED

import {
  ThreeHelper,
  ThreeObject3d,
  OBJECT_3D_CONTROLLER_PROVIDER,
} from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { BoxHelper } from 'three';

@Directive({
  selector: 'ngt-box-helper',
  exportAs: 'ngtBoxHelper',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: BoxHelperDirective,
    },
    OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class BoxHelperDirective extends ThreeHelper<BoxHelper> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof BoxHelper>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof BoxHelper>) {
    this.extraArgs = v;
  }

  helperType = BoxHelper;
}
