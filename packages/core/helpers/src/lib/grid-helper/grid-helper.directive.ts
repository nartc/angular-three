// GENERATED

import { ThreeHelper, ThreeObject3d } from '@angular-three/core';
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
