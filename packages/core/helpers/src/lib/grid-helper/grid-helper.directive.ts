// GENERATED

import { ThreeObject3d } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { GridHelper } from 'three';
import { ThreeHelper } from '../abstracts';

@Directive({
  selector: 'ngt-gridHelper',
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
