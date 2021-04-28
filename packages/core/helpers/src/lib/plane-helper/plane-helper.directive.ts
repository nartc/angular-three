// GENERATED

import {
  ThreeHelper,
  ThreeObject3d,
  OBJECT_3D_CONTROLLER_PROVIDER,
} from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { PlaneHelper } from 'three';

@Directive({
  selector: 'ngt-plane-helper',
  exportAs: 'ngtPlaneHelper',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: PlaneHelperDirective,
    },
    OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class PlaneHelperDirective extends ThreeHelper<PlaneHelper> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof PlaneHelper>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof PlaneHelper>) {
    this.extraArgs = v;
  }

  helperType = PlaneHelper;
}
