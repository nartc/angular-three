// GENERATED

import {
  ThreeHelper,
  ThreeObject3d,
  OBJECT_3D_CONTROLLER_PROVIDER,
} from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { PolarGridHelper } from 'three';

@Directive({
  selector: 'ngt-polar-grid-helper',
  exportAs: 'ngtPolarGridHelper',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: PolarGridHelperDirective,
    },
    OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class PolarGridHelperDirective extends ThreeHelper<PolarGridHelper> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof PolarGridHelper>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof PolarGridHelper>) {
    this.extraArgs = v;
  }

  helperType = PolarGridHelper;
}
