// GENERATED

import {
  ThreeHelper,
  ThreeObject3d,
  OBJECT_3D_CONTROLLER_PROVIDER,
} from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { GridHelper } from 'three';

@Directive({
  selector: 'ngt-grid-helper',
  exportAs: 'ngtGridHelper',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: GridHelperDirective,
    },
    OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class GridHelperDirective extends ThreeHelper<GridHelper> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof GridHelper>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof GridHelper>) {
    this.extraArgs = v;
  }

  helperType = GridHelper;
}
